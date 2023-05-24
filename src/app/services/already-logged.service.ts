import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AlreadyLogged = () => {
    const router = inject(Router)
    const authService = inject(AuthService);

    if(authService.isLoggedIn()) {
        router.navigate(['']);
        return false;
    }

    return true;
}