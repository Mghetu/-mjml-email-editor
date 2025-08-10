import React, { useEffect, useRef, useState } from 'react';
import createStudioEditor from '@grapesjs/studio-sdk';
import { layoutSidebarButtons } from '@grapesjs/studio-sdk-plugins';
import '@grapesjs/studio-sdk/style';

interface StudioEditorInstance {
  getProject: () => any;
  loadProject: (project: any) => void;
}

interface ProjectData {
  pages?: Array<{
    name: string;
    component: string;
  }>;
}

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

const MJMLEmailEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const studioEditorRef = useRef<StudioEditorInstance | null>(null);
  const [status, setStatus] = useState<string>('Ready');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Storage handlers
  const onSave = async ({ project }: { project: ProjectData }) => {
    try {
      const projectData = JSON.stringify(project);
      localStorage.setItem('mjml-editor-project', projectData);
      setStatus('Project saved!');
      console.log('Project saved to localStorage');
    } catch (error) {
      console.error('Save failed:', error);
      setStatus('Save failed');
      throw error;
    }
  };

  const onLoad = async () => {
    try {
      const projectData = localStorage.getItem('mjml-editor-project');
      if (projectData) {
        const project = JSON.parse(projectData);
        setStatus('Project loaded!');
        console.log('Project loaded from localStorage');
        return { project };
      } else {
        return {
          project: {
            pages: [{
              name: 'Email Template',
              component: defaultMJMLTemplate
            }]
          }
        };
      }
    } catch (error) {
      console.error('Load failed:', error);
      setStatus('Load failed');
      return {
        project: {
          pages: [{
            name: 'Email Template',
            component: defaultMJMLTemplate
          }]
        }
      };
    }
  };

  // Asset handlers
  const onUpload = async ({ files }: { files: File[] }) => {
    try {
      setStatus('Upload not implemented yet');
      console.warn('Upload functionality needs backend implementation');
      
      const results = Array.from(files).map(file => ({
        src: URL.createObjectURL(file),
        name: file.name
      }));
      
      return results;
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('Upload failed');
      return [];
    }
  };

  const onDelete = async ({ assets }: { assets: any[] }) => {
    try {
      setStatus('Delete not implemented yet');
      console.warn('Delete functionality needs backend implementation');
      assets.forEach(asset => {
        if (asset.src && asset.src.startsWith('blob:')) {
          URL.revokeObjectURL(asset.src);
        }
      });
    } catch (error) {
      console.error('Delete failed:', error);
      setStatus('Delete failed');
    }
  };

  const exportMJML = () => {
    try {
      if (studioEditorRef.current) {
        const project = studioEditorRef.current.getProject();
        const mjmlCode = project?.pages?.[0]?.component || '';
        navigator.clipboard.writeText(mjmlCode);
        setStatus('MJML copied to clipboard!');
      }
    } catch (error) {
      console.error('Export failed:', error);
      setStatus('Export failed');
    }
  };

  const downloadMJML = (filename: string = 'newsletter.mjml') => {
    try {
      if (studioEditorRef.current) {
        const project = studioEditorRef.current.getProject();
        const mjmlCode = project?.pages?.[0]?.component || '';
        
        const blob = new Blob([mjmlCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.endsWith('.mjml') ? filename : filename + '.mjml';
        a.click();
        URL.revokeObjectURL(url);
        
        setStatus('Downloaded!');
      }
    } catch (error) {
      console.error('Download failed:', error);
      setStatus('Download failed');
    }
  };

  useEffect(() => {
    const initializeEditor = async () => {
      if (!editorRef.current) return;

      try {
        setIsLoading(true);
        setError(null);
        console.log('🚀 Initializing MJML Editor with Layout Sidebar...');

        const editor = await createStudioEditor({
          root: editorRef.current,
          licenseKey: 'd8c583c16c0545ed84f39d90415813727f40d902b1144a5c84f2200765ec4562',
          theme: 'dark',
          
          project: {
            type: 'email'
          },

          assets: {
            storageType: 'self',
            onUpload,
            onDelete
          },

          storage: {
            type: 'self',
            onSave,
            onLoad,
            autosaveChanges: 100,
            autosaveIntervalMs: 10000
          },

          plugins: [
            layoutSidebarButtons.init({
              /* Plugin options can be added here */
            })
          ]
        });

        studioEditorRef.current = editor;
        console.log('✅ Studio SDK initialized with Layout Sidebar');
        setStatus('Ready!');
        setIsLoading(false);

      } catch (error) {
        console.error('❌ Failed:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setStatus('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
        setIsLoading(false);
      }
    };

    initializeEditor();

    // Cleanup
    return () => {
      if (studioEditorRef.current) {
        // Add cleanup logic if needed
      }
    };
  }, []);

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        padding: '40px', 
        textAlign: 'center' 
      }}>
        <div style={{ 
          maxWidth: '500px', 
          background: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ color: '#e53e3e', marginTop: 0 }}>⚠️ Editor Failed to Load</h3>
          <p><strong>Error:</strong> {error}</p>
          <p>This could be due to:</p>
          <ul style={{ textAlign: 'left' }}>
            <li>Network connectivity issues</li>
            <li>CDN blocking</li>
            <li>Browser compatibility</li>
            <li>Plugin loading failure</li>
          </ul>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '12px 24px', 
              background: '#667eea', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        padding: '12px 16px', 
        alignItems: 'center', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        <button onClick={exportMJML} style={{ 
          padding: '8px 16px', 
          border: 'none', 
          borderRadius: '6px', 
          background: 'rgba(255,255,255,0.2)', 
          color: 'white', 
          cursor: 'pointer' 
        }}>
          📋 Copy MJML
        </button>
        
        <button onClick={() => downloadMJML()} style={{ 
          padding: '8px 16px', 
          border: 'none', 
          borderRadius: '6px', 
          background: 'rgba(255,255,255,0.2)', 
          color: 'white', 
          cursor: 'pointer' 
        }}>
          💾 Download
        </button>

        <span style={{ marginLeft: 'auto', fontSize: '13px' }}>
          Status: {status}
        </span>
      </div>

      {/* Editor */}
      {isLoading ? (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div>Loading MJML Editor...</div>
        </div>
      ) : (
        <div 
          ref={editorRef} 
          style={{ 
            flex: 1, 
            margin: '8px', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
            background: 'white' 
          }} 
        />
      )}
    </div>
  );
};

export default MJMLEmailEditor;
