import React, { useState } from 'react';
import { Wand2, Sun, Moon, Search, Download, Sparkles, Type, Hash, Clock, Palette } from 'lucide-react';
import { generateContent } from './lib/gemini';

interface ContentState {
  keyword: string;
  output: string;
  wordCount: number;
  isLoading: boolean;
  tone: 'professional' | 'casual' | 'academic' | 'creative';
  format: 'article' | 'blog' | 'essay' | 'report';
}

function App() {
  const [isDark, setIsDark] = useState(true);
  const [content, setContent] = useState<ContentState>({
    keyword: '',
    output: '',
    wordCount: 500,
    isLoading: false,
    tone: 'professional',
    format: 'article'
  });

  const handleGenerate = async () => {
    if (!content.keyword) {
      alert('Please enter a keyword');
      return;
    }

    setContent(prev => ({ ...prev, isLoading: true }));
    try {
      const generatedContent = await generateContent(content.keyword, content.wordCount, content.tone, content.format);
      setContent(prev => ({ ...prev, output: generatedContent }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setContent(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleExport = () => {
    if (!content.output) return;
    
    const blob = new Blob([content.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.keyword.toLowerCase().replace(/\s+/g, '-')}-${content.format}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark ? 'gradient-bg text-white' : 'light-gradient-bg text-gray-900'
    }`}>
      <header className={`fixed w-full z-10 backdrop-blur-md ${
        isDark ? 'bg-gray-900/50' : 'bg-white/50'
      } border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Wand2 className={`w-7 h-7 logo-animation ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <Sparkles className={`w-4 h-4 absolute -top-1 -right-1 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-500'
                } sparkle-animation`} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                ContentWizard
              </h1>
            </div>
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className={`rounded-2xl p-8 backdrop-blur-lg transition-all duration-300 ${
            isDark ? 'bg-gray-800/50' : 'bg-white/50'
          } shadow-lg border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
            <div className="space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  className={`w-full rounded-xl px-6 py-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                    isDark ? 'bg-gray-700/50 text-white' : 'bg-white/80'
                  } border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                  placeholder="What would you like to write about?"
                  value={content.keyword}
                  onChange={(e) => setContent({...content, keyword: e.target.value})}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Hash className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <label className="text-sm font-medium">Word Count</label>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {content.wordCount} words
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={content.wordCount}
                    onChange={(e) => setContent({...content, wordCount: parseInt(e.target.value)})}
                    className="slider-thumb w-full cursor-pointer"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Type className="w-4 h-4" />
                    <label className="text-sm font-medium">Writing Style</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={content.tone}
                      onChange={(e) => setContent({...content, tone: e.target.value as ContentState['tone']})}
                      className={`rounded-lg px-4 py-2 text-sm ${
                        isDark 
                          ? 'bg-gray-700/50 border-gray-600' 
                          : 'bg-white/80 border-gray-300'
                      } border focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="academic">Academic</option>
                      <option value="creative">Creative</option>
                    </select>
                    <select
                      value={content.format}
                      onChange={(e) => setContent({...content, format: e.target.value as ContentState['format']})}
                      className={`rounded-lg px-4 py-2 text-sm ${
                        isDark 
                          ? 'bg-gray-700/50 border-gray-600' 
                          : 'bg-white/80 border-gray-300'
                      } border focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                    >
                      <option value="article">Article</option>
                      <option value="blog">Blog Post</option>
                      <option value="essay">Essay</option>
                      <option value="report">Report</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={content.isLoading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                <Search className={`w-5 h-5 ${content.isLoading ? 'animate-spin' : ''}`} />
                <span className="font-medium">{content.isLoading ? 'Crafting magic...' : 'Generate Content'}</span>
              </button>
            </div>
          </div>

          <div className={`rounded-2xl backdrop-blur-lg transition-all duration-300 ${
            isDark ? 'bg-gray-800/50' : 'bg-white/50'
          } shadow-lg border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
            <div className="flex items-center justify-between p-6 border-b border-opacity-10">
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Generated Content</h2>
              </div>
              <button 
                onClick={handleExport}
                disabled={!content.output}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDark 
                    ? 'hover:bg-gray-700/50 disabled:opacity-50' 
                    : 'hover:bg-gray-200/50 disabled:opacity-50'
                }`}>
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
            <div className={`p-8 ${
              isDark ? 'bg-gray-700/30' : 'bg-gray-50/50'
            } rounded-b-2xl`}>
              {content.output ? (
                <div className="prose prose-lg max-w-none">
                  {content.output.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={`mb-6 leading-relaxed ${
                      isDark ? 'text-gray-200' : 'text-gray-700'
                    } animate-fade-in`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                  <Sparkles className={`w-12 h-12 mb-4 ${isDark ? 'text-blue-400' : 'text-blue-500'} animate-pulse`} />
                  <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Your magical content will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className={`py-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        <p>© 2025 ContentWizard. Made with ❤️ by <b><a href="https://t.me/sp_mrt">MrTanzid</a></b></p>
      </footer>
    </div>
  );
}

export default App;