import { Utils } from '@nativescript/core';
import { InAppBrowser } from '@akylas/nativescript-inappbrowser';
import { primaryColor } from '~/variables';
import { alert } from '@nativescript-community/ui-material-dialogs';

export async function openLink(url) {
    try {
        const available = await InAppBrowser.isAvailable();
        if (available) {
            const result = await InAppBrowser.open(url, {
                // iOS Properties
                dismissButtonStyle: 'close',
                preferredBarTintColor: primaryColor,
                preferredControlTintColor: 'white',
                readerMode: false,
                animated: true,
                enableBarCollapsing: false,
                // Android Properties
                showTitle: true,
                toolbarColor: primaryColor,
                secondaryToolbarColor: 'white',
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: false
            });
            return result;
        } else {
            Utils.openUrl(url);
        }
    } catch (error) {
        alert({
            title: 'Error',
            message: error.message,
            okButtonText: 'Ok'
        });
    }
}
