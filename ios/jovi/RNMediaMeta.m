//
//  RNMediaMeta.m
//  Jovi
//
//  Created by Nouman Sakhawat on 28/09/2021.
//

#import "RNMediaMeta.h"
#import <React/RCTLog.h>

static NSArray *metadatas;
@implementation RNMediaMeta

- (NSArray *)metadatas
{
  if (!metadatas) {
    metadatas = @[
      @"albumName",
      @"artist",
      @"comment",
      @"copyrights",
      @"creationDate",
      @"date",
      @"encodedby",
      @"genre",
      @"language",
      @"location",
      @"lastModifiedDate",
      @"performer",
      @"publisher",
      @"title"
    ];
  }
  return metadatas;
}


RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(get:(NSString *)path
                  withOptions:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSFileManager *fileManager = [NSFileManager defaultManager];
  
  BOOL isDir;
  if (![fileManager fileExistsAtPath:path isDirectory:&isDir] || isDir){
    NSError *err = [NSError errorWithDomain:@"file not found" code:-15 userInfo:nil];
    reject([NSString stringWithFormat: @"%lu", (long)err.code], err.localizedDescription, err);
    return;
  }
  
  
    NSMutableDictionary *result = [NSMutableDictionary new];
  
  AVURLAsset *avUrl = [AVURLAsset assetWithURL:[NSURL fileURLWithPath:path]];
  CMTime time = [avUrl duration];
  int seconds = ceil(time.value/time.timescale);
  

  [result setObject:@(seconds) forKey:@"duration"];

      RCTLogInfo(@"Pretending to create an event %@ ", result);
  
      resolve(result);
  
//  NSDictionary *assetOptions = @{AVURLAssetPreferPreciseDurationAndTimingKey: @YES};
//  AVURLAsset *asset = [AVURLAsset URLAssetWithURL:[NSURL fileURLWithPath:path] options:assetOptions];
//
//  NSArray *keys = [NSArray arrayWithObjects:@"commonMetadata", nil];
//  [asset loadValuesAsynchronouslyForKeys:keys completionHandler:^{
//    // string keys
//    for (NSString *key in [self metadatas]) {
//      NSArray *items = [AVMetadataItem metadataItemsFromArray:asset.commonMetadata
//                                                     withKey:key
//                                                    keySpace:AVMetadataKeySpaceCommon];
//      for (AVMetadataItem *item in items) {
//        [result setObject:item.value forKey:key];
//      }
//    }
//
//    if (options[@"getThumb"]) {
//      UIImage *thumbnail;
//      NSArray *artworks = [AVMetadataItem metadataItemsFromArray:asset.commonMetadata
//                                                        withKey:AVMetadataCommonKeyArtwork
//                                                        keySpace:AVMetadataKeySpaceCommon];
//      // artwork thumb
//      for (AVMetadataItem *item in artworks) {
//        thumbnail = [UIImage imageWithData:item.value];
//      }
//      if (thumbnail) {
//        [result setObject:@(thumbnail.size.width) forKey:@"width"];
//        [result setObject:@(thumbnail.size.height) forKey:@"height"];
//        NSString *data = [UIImagePNGRepresentation(thumbnail) base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
//        [result setObject:data
//                  forKey:@"thumb"];
//      }
//
//      // video frame thumb
//      AVAssetImageGenerator *imageGenerator = [[AVAssetImageGenerator alloc]initWithAsset:asset];
//      imageGenerator.appliesPreferredTrackTransform = YES;
//      CMTime duration = [asset duration];
//      CMTime time = CMTimeMake(duration.value / 2, duration.timescale);
//
//      CGImageRef imageRef = [imageGenerator copyCGImageAtTime:time actualTime:NULL error:NULL];
//      thumbnail = [UIImage imageWithCGImage:imageRef];
//      if (thumbnail) {
//        [result setObject:@(thumbnail.size.width) forKey:@"width"];
//        [result setObject:@(thumbnail.size.height) forKey:@"height"];
//        [result setObject:@((CMTimeGetSeconds(asset.duration) * 1000)) forKey:@"duration"];
//
//        NSString *data = [UIImagePNGRepresentation(thumbnail) base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
//        [result setObject:data
//                  forKey:@"thumb"];
//      }
//      CGImageRelease(imageRef);
//    }
//
//    RCTLogInfo(@"Pretending to create an event %@ ", result);
//
//    resolve(result);
//  }];
}

@end