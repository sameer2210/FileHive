// import { BarChart3, Folder, Image, Search, TrendingUp } from 'lucide-react';

// const sidebarItems = [
//   { id: 'summary', icon: BarChart3, label: 'Summary' },
//   { id: 'folders', icon: Folder, label: 'Folders' },
//   { id: 'images', icon: Image, label: 'Images' },
//   { id: 'search', icon: Search, label: 'Search' },
//   { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
// ];

// const SideBar = ({ activeTab, setActiveTab }) => {
//   return (
//     <div>
//       {/* Desktop Navigation */}
//       <nav className="hidden lg:block space-y-1 sm:space-y-2">
//         {sidebarItems.map(item => {
//           const Icon = item.icon;
//           return (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id)}
//               className={`w-full flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all group ${
//                 activeTab === item.id
//                   ? 'bg-blue-500 text-white shadow-lg'
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//               title={item.label} // Tooltip for mobile icons
//             >
//               <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
//               <span className="hidden lg:block font-medium text-sm lg:text-base">{item.label}</span>
//             </button>
//           );
//         })}
//       </nav>

//       {/* Mobile Navigation */}
//       <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
//         <nav className="flex justify-around py-2">
//           {sidebarItems.map(item => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className={`flex flex-col items-center p-2 rounded-lg transition-all ${
//                   activeTab === item.id ? 'text-blue-500' : 'text-gray-600'
//                 }`}
//               >
//                 <Icon className="h-5 w-5 mb-1" />
//                 <span className="text-xs font-medium">{item.label}</span>
//               </button>
//             );
//           })}
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default SideBar;




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
          fixed lg:relative inset-y-0 left-0 z-50
          w-64 lg:w-64
          bg-gray-50 border-r border-gray-200
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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <div className="font-semibold text-gray-900 truncate">{user?.name || 'User'}</div>
              <div className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full inline-block mt-1">
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
                      ? 'bg-blue-500 text-white shadow-lg'
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