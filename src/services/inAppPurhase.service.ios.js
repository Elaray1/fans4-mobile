import * as iap from 'react-native-iap';

import * as storage from 'helpers/storage';

const subscriptionProductIds = [
  'fighter.subscription.0',
  'fighter.subscription.1',
  'fighter.subscription.2',
  'fighter.subscription.3',
  'fighter.subscription.4',
  'fighter.subscription.5',
  'fighter.subscription.6',
  'fighter.subscription.7',
  'fighter.subscription.8',
  'fighter.subscription.9',
  'fighter.subscription.10',
  'fighter.subscription.11',
  'fighter.subscription.12',
  'fighter.subscription.13',
  'fighter.subscription.14',
  'fighter.subscription.15',
  'fighter.subscription.16',
  'fighter.subscription.17',
  'fighter.subscription.18',
  'fighter.subscription.19',
];

class InAppPurchaseService {
  async connect() {
    return iap.initConnection();
  }

  disconnect() {
    return iap.endConnection();
  }

  getSubscriptions(productIds) {
    return iap.getSubscriptions(productIds);
  }

  async makePurchase(productId, metadata) {
    // it's required to fetch products before make actual purchase
    await this.getSubscriptions([productId]);

    const unfinishedPurchase = await storage.getItem(productId);
    if (!unfinishedPurchase) {
      storage.setItem(productId, JSON.stringify(metadata));
    }

    try {
      await iap.requestPurchase(productId);
    } catch (err) {
      await this.removeSavedPurchaseMetadata(productId);
      throw err;
    }
  }

  setPurchaseListener(callback) {
    iap.purchaseUpdatedListener(callback);
  }

  setPurchaseErrorListener(callback) {
    iap.purchaseErrorListener(callback);
  }

  async finishMakingPurchase(purchase) {
    await iap.finishTransaction(purchase);
    await this.removeSavedPurchaseMetadata(purchase.productId);
  }

  async getSavedPurchaseMetadata(productId) {
    return JSON.parse(await storage.getItem(productId));
  }

  async removeSavedPurchaseMetadata(productId) {
    await storage.removeItem(productId);
  }

  getAvailableSubscriptionProductIds() {
    return subscriptionProductIds;
  }
}

export default new InAppPurchaseService();
