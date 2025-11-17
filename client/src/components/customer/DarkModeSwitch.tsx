
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const DarkModeSwitch = () => {

    const { theme, toggleTheme } = useTheme();

     const isDark = theme === 'dark';

    return (
        <button
        onClick={toggleTheme}
        className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group overflow-hidden"
        aria-label="Toggle theme"
        >
        {/* Animated background glow */}
        <div className="absolute inset-0 rounded-full bg-white/20 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon container with rotation animation */}
        <div className="relative w-6 h-6 transition-transform duration-500 ease-in-out">
            {/* Sun icon */}
            <Sun 
            className={`absolute inset-0 w-6 h-6 text-white transition-all duration-500 ${
                isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
            }`}
            strokeWidth={2.5}
            />
            
            {/* Moon icon */}
            <Moon 
            className={`absolute inset-0 w-6 h-6 text-white transition-all duration-500 ${
                isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            }`}
            strokeWidth={2.5}
            />
        </div>

        {/* Ripple effect on click */}
        <span className="absolute inset-0 rounded-full bg-white/30 scale-0 group-active:scale-100 transition-transform duration-300" />
        </button>
    );
};

export default DarkModeSwitch;