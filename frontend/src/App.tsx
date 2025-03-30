import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Send, Upload, Eye, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import type { EmailFormData } from './types';

const App = () => {
  const [previewHtml, setPreviewHtml] = useState('');
  const [templates, setTemplates] = useState<{ [key: string]: string }>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const [customTemplate, setCustomTemplate] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<EmailFormData>();

  const allFormValues = watch(['to', 'subject', 'hiringPosition', 'companyName', 'jobSource']);

  // Load templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch('/templates/coverletter.html');
        const content = await response.text();
        setTemplates({ coverletter: content });
      } catch (error) {
        console.error('Failed to load templates:', error);
        toast.error('Failed to load email templates');
      }
    };
    loadTemplates();
  }, []);

  const generatePreview = useCallback((data: EmailFormData) => {
    let template = '';
    
    if (data.template === 'custom' && customTemplate) {
      template = customTemplate;
    } else {
      template = templates[data.template] || '';
    }

    if (!template) {
      toast.error('Template not found');
      return;
    }

    let preview = template;
    // Replace placeholders with actual values
    preview = preview.replace(/\[Hiring Manager\]/g, data.hiringManager || '');
    preview = preview.replace(/\[Position\]/g, data.hiringPosition || '');
    preview = preview.replace(/\[Company\]/g, data.companyName || '');
    preview = preview.replace(/\[Job Source\]/g, data.jobSource || '');
    
    setPreviewHtml(preview);
  }, [templates, customTemplate]);

  useEffect(() => {
    const subscription = watch((value) => {
      generatePreview({
        ...value,
        hiringPosition: allFormValues[2] || '',
        companyName: allFormValues[3] || '',
        jobSource: allFormValues[4] || '',
      } as EmailFormData);
    });

    return () => subscription.unsubscribe();
  }, [allFormValues, templates, customTemplate, generatePreview, watch]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments(Array.from(files));
    }
  };

  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const content = await file.text();
        setCustomTemplate(content);
        // Update the form to use custom template
        const form = document.querySelector('form');
        if (form) {
          const templateSelect = form.querySelector('select[name="template"]') as HTMLSelectElement;
          if (templateSelect) {
            templateSelect.value = 'custom';
          }
        }
        // Generate preview with the new template
        generatePreview({ ...watch(), template: 'custom' });
        toast.success('Custom template loaded successfully');
      } catch (error) {
        console.error('Error loading template:', error);
        toast.error('Failed to load custom template');
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EmailFormData) => {
    try {
      let template = '';
      
      if (data.template === 'custom' && customTemplate) {
        template = customTemplate;
      } else {
        template = templates[data.template] || '';
      }

      if (!template) {
        throw new Error('Template not found');
      }

      let emailContent = template;
      // Replace placeholders with actual values
      emailContent = emailContent.replace(/\[Hiring Manager\]/g, data.hiringManager);
      emailContent = emailContent.replace(/\[Position\]/g, data.hiringPosition);
      emailContent = emailContent.replace(/\[Company\]/g, data.companyName);
      emailContent = emailContent.replace(/\[Job Source\]/g, data.jobSource);

      // Create FormData for sending
      const formData = new FormData();
      formData.append('to', data.to);
      formData.append('cc', data.cc);
      formData.append('bcc', data.bcc);
      formData.append('subject', data.subject);
      formData.append('content', emailContent);
      
      // Add attachments if any
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      // Send email using our backend
      const response = await fetch('http://localhost:4001/api/send-email', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to send email');
      }

      // Show success message with recipient email
      toast.success(`Email sent successfully to ${data.to}!`, {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#4CAF50',
          color: '#fff',
        },
      });

      // Reset form fields after 3 seconds
      setTimeout(() => {
        // Reset form
        const form = document.querySelector('form');
        if (form) {
          form.reset();
        }
        // Reset attachments
        setAttachments([]);
        // Reset custom template if it was used
        if (data.template === 'custom') {
          setCustomTemplate(null);
        }
        // Reset preview
        setPreviewHtml('');
      }, 3000);

    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#f44336',
          color: '#fff',
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-indigo-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">TrailMail</h1>
          </div>
          <div className="relative group">
            <a 
              href="https://github.com/sreesreejuks/trailmail" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg 
                className="h-8 w-8" 
                fill="currentColor" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.91-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" 
                  clipRule="evenodd" 
                />
              </svg>
            </a>
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Go to repository
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Compose Email</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">To</label>
                <input
                  type="email"
                  {...register('to', { required: true })}
                  placeholder="e.g., hiring@company.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
                {errors.to && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">CC</label>
                <input
                  type="text"
                  {...register('cc')}
                  placeholder="e.g., hr@company.com, recruiter@company.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">BCC</label>
                <input
                  type="text"
                  {...register('bcc')}
                  placeholder="e.g., your-email@example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  {...register('subject', { required: true })}
                  placeholder="e.g., Application for DevOps Engineer Position | Sreeju KS"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
                {errors.subject && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  {...register('companyName', { required: true })}
                  placeholder="e.g., Google, Microsoft, Amazon"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
                {errors.companyName && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hiring Position</label>
                <input
                  type="text"
                  {...register('hiringPosition', { required: true })}
                  placeholder="e.g., DevOps Engineer, Software Engineer"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
                {errors.hiringPosition && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hiring Manager</label>
                <input
                  type="text"
                  {...register('hiringManager', { required: true })}
                  placeholder="e.g., John Doe, Sarah Smith"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
                {errors.hiringManager && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Where did you find the job?</label>
                <input
                  type="text"
                  {...register('jobSource', { required: true })}
                  placeholder="e.g., LinkedIn, Indeed, Company Website"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                />
                {errors.jobSource && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Template</label>
                <div className="mt-1 space-y-4">
                  <select
                    {...register('template', { required: true })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="coverletter">Cover Letter</option>
                    <option value="custom">Custom Template</option>
                  </select>
                  {watch('template') === 'custom' && (
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload HTML Template</span>
                            <input
                              type="file"
                              accept=".html"
                              className="sr-only"
                              onChange={handleTemplateUpload}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {errors.template && <span className="text-red-500 text-sm">This field is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Attachments</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload files</span>
                        <input
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Attached files:</p>
                    <ul className="divide-y divide-gray-200">
                      {attachments.map((file, index) => (
                        <li key={index} className="py-2 flex items-center justify-between">
                          <span className="text-sm text-gray-600">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => generatePreview(watch())}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </button>
              </div>

              <Toaster
                position="bottom-center"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: '#333',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '8px',
                  },
                  success: {
                    style: {
                      background: '#4CAF50',
                    },
                  },
                  error: {
                    style: {
                      background: '#f44336',
                    },
                  },
                }}
              />
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Preview</h2>
            <div 
              className="prose max-w-none [&>*:first-child]:mt-0"
              dangerouslySetInnerHTML={{ __html: previewHtml || 'Preview will appear here...' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;