import { environment } from '../../environments/environment';
export const Config = {
    apipath: {
        prod: 'http://localhost:4200/',
        dev: 'http://localhost:3200',
    },
    imagepath: {
        defualtImage: 'default.jpg',
        // space: 'https://s3.amazonaws.com/panoptico/sensor-space',
        // space: 'https://s3.amazonaws.com/panoptico/sensor-space',
        // space: 'http://192.168.1.54:3000/uploads/sensorspace',
        // sensor: 'http://192.168.1.54:3000/uploads/sensorpoint',
        // profile: 'http://192.168.1.54:3000/uploads/userprofile'
    },
    module: {
        api: {
            endpoints: {
                register: '/api/register',
                login: '/api/authenticate',
                getwomenscloth: '/api/getwomenscloth',
                getallproducts: '/api/getallproducts',
                logout: '/api/logout',
                getloggeduser: '/api/getloggeduser'
            }
        },
    }
};
