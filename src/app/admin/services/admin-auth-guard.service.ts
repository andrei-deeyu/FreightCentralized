import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';


export const AdminAuthGuard = () => {
    const router = inject(Router)
    const authService = inject(AuthService);

    authService.user$.subscribe(user => {
        if(user?.['app_metadata'].admin) return true;
        router.navigate(['/no-access']);
        return false;
    });

}