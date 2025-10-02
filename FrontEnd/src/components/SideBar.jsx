import { BarChart3, Folder, Image, Search, TrendingUp, X } from 'lucide-react';

const sidebarItems = [
  { id: 'summary', icon: BarChart3, label: 'Summary' },
  { id: 'folders', icon: Folder, label: 'Folders' },
  { id: 'images', icon: Image, label: 'Images' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
];

const SideBar = ({ activeTab, setActiveTab, user, isSidebarOpen, setIsSidebarOpen }) => {
  const handleTabChange = tabId => {
    setActiveTab(tabId);
    if (setIsSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Desktop & Mobile Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 mt-1
          w-64 lg:w-64
          bg-gray-100 border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile Close Button */}
        <button
          className="absolute top-4 right-4 p-2 lg:hidden text-gray-500 hover:text-gray-700 z-10"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 h-full overflow-y-auto">
          {/* Profile Section */}
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-stone-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <div className="font-semibold text-gray-900 truncate">{user?.name || 'User'}</div>
              <div className="text-sm  bg-purple-100 px-2 py-1 rounded-full inline-block mt-1">
                PREMIUM
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-stone-500 to-red-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-bottom">
        <nav className="flex justify-around py-2 px-2">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all min-w-0 flex-1 ${
                  activeTab === item.id ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5 mb-1 flex-shrink-0" />
                <span className="text-xs font-medium truncate w-full text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;
