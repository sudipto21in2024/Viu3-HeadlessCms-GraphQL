import { ref, watch, onMounted } from 'vue';

const THEME_KEY = 'maison_aura_theme';
const currentTheme = ref('theme-alabaster');

export function useTheme() {
  const initTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'theme-obsidian' || saved === 'theme-alabaster') {
      currentTheme.value = saved;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme.value = 'theme-obsidian';
    } else {
      currentTheme.value = 'theme-alabaster';
    }
    applyTheme(currentTheme.value);
  };

  const applyTheme = (theme) => {
    document.body.classList.remove('theme-alabaster', 'theme-obsidian');
    document.body.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  };

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'theme-alabaster' ? 'theme-obsidian' : 'theme-alabaster';
    applyTheme(currentTheme.value);
  };

  onMounted(() => {
    initTheme();
  });

  return {
    currentTheme,
    isDark: () => currentTheme.value === 'theme-obsidian',
    toggleTheme
  };
}
