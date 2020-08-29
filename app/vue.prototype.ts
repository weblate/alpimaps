import * as application from '@nativescript/core/application';
import { $t, $tc, $tt, $tu } from '~/helpers/locale';
import { device, screen } from '@nativescript/core/platform';
import App from '~/components/App';
import Map from '~/components/Map';
import PackageService from '~/services/PackageService';
import { BgService } from './services/BgService';
import { NetworkService } from './services/NetworkService';
import { ToastDuration, ToastPosition, Toasty } from 'nativescript-toasty';
import * as imageModule from 'nativescript-image';

const Plugin = {
    install(Vue) {
        const bgService = new BgService();
        Vue.prototype.$bgService = bgService;
        const packageService = new PackageService();
        Vue.prototype.$packageService = packageService;
        const networkService = new NetworkService();
        Vue.prototype.$networkService = networkService;

        application.on(application.launchEvent, () => {
            console.log('App Launched');
            imageModule.initialize({ isDownsampleEnabled: true });

            if (gVars.isAndroid) {
                bgService.start();
                networkService.start();
                // const receiverCallback = (androidContext, intent: android.content.Intent) => {
                //     console.log('receiverCallback', intent.getAction(), intent.getAction() === android.content.Intent.ACTION_SCREEN_ON);
                //     // (Vue.prototype.$getAppComponent() as App).$emit('screen', intent.getAction() === android.content.Intent.ACTION_SCREEN_ON);
                // };
                // application.android.registerBroadcastReceiver(android.content.Intent.ACTION_SCREEN_ON, receiverCallback);
                // application.android.registerBroadcastReceiver(android.content.Intent.ACTION_SCREEN_OFF, receiverCallback);
            }
        });
        application.on(application.exitEvent, () => {
            console.log('App Exited');
            imageModule.shutDown();
            networkService.stop();
            // if (gVars.isAndroid) {
                // application.android.unregisterBroadcastReceiver(android.content.Intent.ACTION_SCREEN_ON);
                // application.android.unregisterBroadcastReceiver(android.content.Intent.ACTION_SCREEN_OFF);
            // }
        });
        if (gVars.isIOS) {
            bgService.start();
            networkService.start();
        }
        let appComponent: App;
        Vue.prototype.$setAppComponent = function(comp: App) {
            appComponent = comp;
        };
        Vue.prototype.$getAppComponent = function() {
            return appComponent;
        };
        let mapComponent: Map;
        Vue.prototype.$setMapComponent = function(comp: Map) {
            mapComponent = comp;
            appComponent.setMapMounted(true);
        };
        Vue.prototype.$getMapComponent = function() {
            return mapComponent;
        };

        // Vue.prototype.__defineGetter__('isSimulator', () => false);
        // Vue.prototype.__defineGetter__('isAndroid', () => gVars.isAndroid);
        // Vue.prototype.__defineGetter__('isIOS', () => gVars.isIOS);

        Vue.prototype.isSimulator = false;
        Vue.prototype.isAndroid = gVars.isAndroid;
        Vue.prototype.isIOS = gVars.isIOS;
        const filters = (Vue.prototype.$filters = Vue['options'].filters);
        Vue.prototype.$t = $t;

        Vue.prototype.$tc = $tc;
        Vue.prototype.$tt = $tt;
        Vue.prototype.$tu = $tu;
        Vue.prototype.$showError = function(err: Error) {
            if (!err) {
                return;
            }
            console.log('showError', err, err.toString(), err.stack);
            const message = typeof err === 'string' ? err : err.toString();
            return alert({
                title: Vue.prototype.$tc('error'),
                okButtonText: Vue.prototype.$tc('ok'),
                message
            });
        };
        Vue.prototype.$showToast = function(text: string, duration?: ToastDuration, position?: ToastPosition) {
            const toasty = new Toasty({ text, duration, position });
            toasty.show();
            return toasty;
        };
        Vue.prototype.$alert = function(message) {
            return alert({
                okButtonText: Vue.prototype.$tc('ok'),
                message
            });
        };

        /* DEV-START */
        console.log('model', device.model);
        console.log('os', device.os);
        console.log('osVersion', device.osVersion);
        console.log('manufacturer', device.manufacturer);
        console.log('deviceType', device.deviceType);
        console.log('widthPixels', screen.mainScreen.widthPixels);
        console.log('heightPixels', screen.mainScreen.heightPixels);
        console.log('widthDIPs', screen.mainScreen.widthDIPs);
        console.log('heightDIPs', screen.mainScreen.heightDIPs);
        console.log('scale', screen.mainScreen.scale);
        console.log('ratio', screen.mainScreen.heightDIPs / screen.mainScreen.widthDIPs);
        /* DEV-END */
    }
};

export default Plugin;
