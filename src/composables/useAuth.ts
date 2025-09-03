import { useUserStore } from '../store';
import { useRouter } from 'vue-router';

export function useAuth() {
  const userStore = useUserStore();
  const router = useRouter();

  const isAuthenticated = () => {
    return !!userStore.accessToken;
  };

  const logout = () => {
    const shouldRedirect = userStore.logout();
    if (shouldRedirect) {
      router.push('/login');
    }
  };

  const checkAuth = () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const redirectToLogin = () => {
    router.push('/login');
  };

  return {
    isAuthenticated,
    logout,
    checkAuth,
    redirectToLogin,
    userStore
  };
}
