import { inject } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const AuthGuard = (state: RouterStateSnapshot) => {
    const router = inject(Router)
    const authService = inject(AuthService);

    if(authService.isLoggedIn()) return true;

    router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
}