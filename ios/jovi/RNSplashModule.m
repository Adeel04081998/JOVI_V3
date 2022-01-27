//
//  RNSplashModule.m
//  jovi
//
//  Created by Nouman Sakhawat on 27/01/2022.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import "RNSplashModule.h"
#import <UIKit/UIKit.h>
#import "AppDelegate.h"

static UIView* loadingView = nil;

@implementation RNSplashModule

//// To export a module named RNSplashModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(hideSplash)
{
  dispatch_sync(dispatch_get_main_queue(), ^{
      // Update the UI on the main thread.
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [appDelegate resetRoot];
  });

}

@end


