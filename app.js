// Global variables
let studioEditor = null;

// Helper function to update status
function setStatus(message, type = 'default') {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  
  // Auto-clear after 3 seconds
  setTimeout(() => {
    statusEl.textContent = 'Ready';
  }, 3000);
}

// Default MJML template
const defaultMJMLTemplate = `<mjml>
  <mj-head>
    <mj-title>Newsletter Template</mj-title>
    <mj-preview>Your weekly newsletter</mj-preview>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
      <mj-text font-size="14px" color="#000000" line-height="20px" />
      <mj-button background-color="#667eea" color="white" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f4f6f8">
    <!-- Header -->
    <mj-section background-color="#667eea" padding="20px 0">
      <mj-column>
        <mj-text align="center" color="white" font-size="28px" font-weight="bold">
          Your Newsletter
        </mj-text>
        <mj-text align="center" color="white" font-size="16px">
          Built with Studio SDK
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Welcome -->
    <mj-section background-color="white" padding="40px 25px">
      <mj-column>
        <mj-text font-size="18px" font-weight="bold" color="#2d3748">
          Welcome to Your MJML Editor! 🚀
        </mj-text>
        <mj-text color="#4a5568" line-height="24px">
          This professional email editor is powered by GrapesJS Studio SDK. 
          Create beautiful, responsive emails with drag-and-drop MJML components.
        </mj-text>
        <mj-button background-color="#667eea" href="#" padding="15px 0">
          Get Started
        </mj-button>
      </mj-column>
    </mj-section>

    <!-- Features -->
    <mj-section background-color="#f7fafc" padding="40px 25px">
      <mj-column width="50%">
        <mj-text font-size="16px" font-weight="bold" color="#2d3748">
          📧 Professional Design
        </mj-text>
        <mj-text color="#4a5568" line-height="22px">
          MJML components ensure perfect rendering in all email clients.
        </mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text font-size="16px" font-weight="bold" color="#2d3748">
          ⚡ Fast & Reliable
        </mj-text>
        <mj-text color="#4a5568" line-height="22px">
          GitHub hosted with Studio SDK for professional editing.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section background-color="#2d3748" padding="30px 25px">
      <mj-column>
        <mj-text align="center" color="white" font-size="14px">
          © 2025 Your Company. Built with GrapesJS Studio SDK
        </mj-text>
        <mj-text align="center" color="#a0aec0" font-size="11px">
          <a href="#" style="color: #667eea;">Unsubscribe</a> | 
          <a href="#" style="color: #667eea;">Preferences</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

// Initialize Studio SDK
async function initializeEditor() {
  try {
    setStatus('Loading...');
    console.log('🚀 Initializing MJML Editor...');
    
    // Check if Studio SDK is available
    if (typeof GrapesJsStudioSDK === 'undefined') {
      throw new Error('Studio SDK not loaded');
    }
    
    studioEditor = await GrapesJsStudioSDK.createStudioEditor({
      root: '#studio-editor',
      licenseKey: 'DEMO_LOCALHOST_KEY',
      theme: 'light',
      
      project: {
        type: 'email',
        default: {
          pages: [{
            name: 'Email Template',
            component: defaultMJMLTemplate
          }]
        }
      },
      
      storage: {
        type: 'local'
      }
    });
    
    console.log('✅ Studio SDK initialized');
    setupUI();
    setStatus('Ready!');
    
  } catch (error) {
    console.error('❌ Failed:', error);
    setStatus('Error: ' + error.message);
    showError(error);
  }
}

// Show error message
function showError(error) {
  document.getElementById('studio-editor').innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 40px; text-align: center;">
      <div style="max-width: 500px; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <h3 style="color: #e53e3e; margin-top: 0;">⚠️ Editor Failed to Load</h3>
        <p><strong>Error:</strong> ${error.message}</p>
        <p>This could be due to:</p>
        <ul style="text-align: left;">
          <li>Network connectivity issues</li>
          <li>CDN blocking</li>
          <li>Browser compatibility</li>
        </ul>
        <button onclick="location.reload()" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
          🔄 Retry
        </button>
      </div>
    </div>
  `;
}

// Setup UI handlers
function setupUI() {
  console.log('🔧 Setting up UI...');
  
  // View Code
  document.getElementById('btnViewCode').onclick = () => {
    try {
      const project = studioEditor.getProject();
      const mjmlCode = project?.pages?.[0]?.component || '';
      document.getElementById('mjml-code').textContent = mjmlCode;
      document.getElementById('code-viewer').style.display = 'flex';
    } catch (error) {
      setStatus('Error showing code');
    }
  };

  // Copy Code
  document.getElementById('btnCopyCode').onclick = async () => {
    try {
      const code = document.getElementById('mjml-code').textContent;
      await navigator.clipboard.writeText(code);
      setStatus('Copied!');
    } catch (error) {
      setStatus('Copy failed');
    }
  };

  // Export
  document.getElementById('btnExport').onclick = async () => {
    try {
      const project = studioEditor.getProject();
      const mjmlCode = project?.pages?.[0]?.component || '';
      await navigator.clipboard.writeText(mjmlCode);
      setStatus('MJML copied!');
    } catch (error) {
      setStatus('Export failed');
    }
  };

  // Save
  document.getElementById('btnSave').onclick = () => {
    try {
      const project = studioEditor.getProject();
      const mjmlCode = project?.pages?.[0]?.component || '';
      const filename = document.getElementById('templateName').value || 'newsletter.mjml';
      
      const blob = new Blob([mjmlCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.endsWith('.mjml') ? filename : filename + '.mjml';
      a.click();
      URL.revokeObjectURL(url);
      
      setStatus('Downloaded!');
    } catch (error) {
      setStatus('Save failed');
    }
  };

  // Load
  document.getElementById('btnLoad').onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mjml,.html';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const mjmlContent = e.target.result;
            const project = studioEditor.getProject();
            if (project?.pages?.[0]) {
              project.pages[0].component = mjmlContent;
              studioEditor.loadProject(project);
            }
            setStatus('Loaded!');
          } catch (error) {
            setStatus('Load failed');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  console.log('✅ UI ready');
}

// Initialize when ready
document.addEventListener('DOMContentLoaded', initializeEditor);
console.log('📜 App loaded');
