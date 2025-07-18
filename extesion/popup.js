// popup.js - Script do popup da extensão
let extractedData = null;

document.addEventListener('DOMContentLoaded', async () => {
  const statusIcon = document.getElementById('statusIcon');
  const statusText = document.getElementById('statusText');
  const extractBtn = document.getElementById('extractBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const resultDiv = document.getElementById('result');
  const resultData = document.getElementById('resultData');
  const errorDiv = document.getElementById('error');
  const loadingDiv = document.getElementById('loading');
  
  // Verificar se estamos em uma página da Shopee
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab.url && tab.url.includes('shopee.com.br')) {
    // Verificar se é uma página de produto
    if (tab.url.includes('/product/') || tab.url.includes('-i.')) {
      statusIcon.classList.remove('inactive');
      statusIcon.classList.add('active');
      statusText.textContent = 'Página de produto detectada';
      extractBtn.disabled = false;
    } else {
      statusText.textContent = 'Navegue até um produto';
      showError('Por favor, acesse uma página de produto da Shopee');
    }
  } else {
    statusText.textContent = 'Não está na Shopee';
    showError('Esta extensão funciona apenas em shopee.com.br');
  }
  
  // Botão de extrair dados
  extractBtn.addEventListener('click', async () => {
    try {
      hideError();
      hideResult();
      showLoading();
      extractBtn.disabled = true;
      
      // Primeiro, testar se o content script está carregado
      console.log('🔍 Testando comunicação com content script...');
      
      try {
        // Teste ping primeiro
        await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
        console.log('✅ Content script respondeu ao ping');
      } catch (pingError) {
        console.log('❌ Content script não responde, tentando injetar...');
        
        // Tentar injetar o content script
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        
        // Aguardar um pouco para o script carregar
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ Content script injetado');
      }
      
      // Agora enviar mensagem para extrair dados
      console.log('📡 Enviando comando de extração...');
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractData' });
      
      hideLoading();
      
      if (response && response.success) {
        extractedData = response.data;
        showResult(extractedData);
        downloadBtn.style.display = 'block';
        console.log('✅ Dados extraídos com sucesso:', extractedData);
      } else {
        const errorMsg = response ? response.error : 'Resposta inválida do content script';
        showError('Erro ao extrair dados: ' + errorMsg);
        console.error('❌ Erro na extração:', errorMsg);
      }
      
    } catch (error) {
      hideLoading();
      console.error('❌ Erro geral:', error);
      
      if (error.message.includes('Could not establish connection') || 
          error.message.includes('receiving end does not exist')) {
        showError('❌ Content script não carregado. Recarregue a página da Shopee e tente novamente.');
      } else if (error.message.includes('scripting')) {
        showError('❌ Erro de permissão. Recarregue a extensão em chrome://extensions/');
      } else {
        showError('❌ Erro inesperado: ' + error.message);
      }
    } finally {
      extractBtn.disabled = false;
    }
  });
  
  // Botão de download
  downloadBtn.addEventListener('click', () => {
    if (extractedData) {
      downloadJSON(extractedData);
    }
  });
  
  // Funções auxiliares
  function showLoading() {
    loadingDiv.style.display = 'block';
  }
  
  function hideLoading() {
    loadingDiv.style.display = 'none';
  }
  
  function showResult(data) {
    resultDiv.style.display = 'block';
    resultData.textContent = JSON.stringify(data, null, 2);
  }
  
  function hideResult() {
    resultDiv.style.display = 'none';
  }
  
  function showError(message) {
    errorDiv.style.display = 'block';
    errorDiv.textContent = '❌ ' + message;
  }
  
  function hideError() {
    errorDiv.style.display = 'none';
  }
  
  function downloadJSON(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `shopee-product-${timestamp}.json`;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        showError('Erro ao baixar arquivo: ' + chrome.runtime.lastError.message);
      } else {
        // Mostrar mensagem de sucesso temporária
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
          background: #52c41a;
          color: white;
          padding: 10px;
          border-radius: 6px;
          margin-top: 10px;
          text-align: center;
        `;
        successMsg.textContent = '✅ Download iniciado!';
        document.querySelector('.actions').appendChild(successMsg);
        
        setTimeout(() => successMsg.remove(), 3000);
      }
      
      // Limpar URL do blob
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
});