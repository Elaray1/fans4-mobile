#import <React/RCTBridgeDelegate.h>
#import <UserNotifications/UNUserNotificationCenter.h>
#import <UIKit/UIKit.h>
#import <UMCore/UMAppDelegateWrapper.h>

@interface AppDelegate : UMAppDelegateWrapper <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
