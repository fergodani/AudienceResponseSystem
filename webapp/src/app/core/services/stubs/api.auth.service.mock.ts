import { User } from '@app/core/models/user.model';
import { of } from 'rxjs';

export class AuthServiceStub {
    user = of({
        id: 1,
        username: "admin",
        role: 'admin'
    })
    
}