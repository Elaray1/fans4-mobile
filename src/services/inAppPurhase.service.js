import * as iap from 'expo-in-app-purchases';
import * as storage from 'helpers/storage';

class InAppPurchaseService {
  async connect() {
    try {
      return await iap.connectAsync();
    } catch (err) {
      console.error('InAppPurchase connect error', err);
    }
  }

  async disconnect() {
    try {
      return await iap.disconnectAsync();
    } catch (err) {
      console.error('InAppPurchase disconnect error', err);
    }
  }

  getProducts(productIds) {
    return iap.getProductsAsync(productIds);
  }

  getPurchasesHistory() {
    return iap.getPurchaseHistoryAsync();
  }

  async purchaseProduct(productId, metadata) {
    // it's required to fetch products before make actual purchase
    await this.getProducts([productId]);

    const unfinishedPurchase = await storage.getItem(productId);
    if (!unfinishedPurchase) {
      storage.setItem(productId, JSON.stringify(metadata));
    }

    try {
      await iap.purchaseItemAsync(productId);
    } catch (err) {
      console.error('purchaseProduct error:', err);
    }
  }

  setPurchaseListener(callback) {
    iap.setPurchaseListener(callback);
  }

  async finishTransaction(purchase) {
    await this.connect();
    return iap.finishTransactionAsync(purchase, true);
  }

  async getSavedPurchaseMetadata(productId) {
    return JSON.parse(await storage.getItem(productId));
  }

  async removeSavedPurchaseMetadata(productId) {
    await storage.removeItem(productId);
  }

  checkIfPurchaseResponseIsSuccessfull(iapResponse) {
    return iapResponse.responseCode === iap.IAPResponseCode.OK;
  }
}

export default new InAppPurchaseService();
