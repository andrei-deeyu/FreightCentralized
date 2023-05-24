import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AdminAuthGuard = () => {
    const router = inject(Router)
    const authService = inject(AuthService);

    let user = authService.currentUser;
    if(user && user.admin) return true;

    router.navigate(['/no-access']);
    return false;
}