//
//  TextRecognitionModule.m
//  RNMLKitTutorial
//
//  Created by Dmytro on 17.07.2021.
//

// RCTCalendarModule.m
#import "RCTTextRecognitionModule.h"
#import <React/RCTLog.h>

@import MLKit;

@implementation RCTTextRecognitionModule

RCT_EXPORT_MODULE(TextRecognitionModule);


RCT_EXPORT_METHOD(recognizeImage:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  RCTLogInfo(@"URL: %@", url);
  NSURL *_url = [NSURL URLWithString:url];
  NSData *imageData = [NSData dataWithContentsOfURL:_url];
  UIImage *image = [UIImage imageWithData:imageData];

  MLKVisionImage *visionImage = [[MLKVisionImage alloc] initWithImage:image];
    
  // When using Devanagari script recognition SDK
  MLKDevanagariTextRecognizerOptions *devanagariOptions = [[MLKDevanagariTextRecognizerOptions alloc] init];
  MLKTextRecognizer *devanagariTextRecognizer = [MLKTextRecognizer textRecognizerWithOptions:devanagariOptions];
  
  [devanagariTextRecognizer processImage:visionImage
                    completion:^(MLKText *_Nullable result,
                                 NSError *_Nullable error) {
    if (error != nil || result == nil) {
      // Error handling
      reject(@"text_recognition", @"text recognition is failed", nil);
      return;
    }
    
    NSMutableDictionary *response = [NSMutableDictionary dictionary];
    
    
    NSMutableArray *blocks = [NSMutableArray array];
    // Recognized text
//    NSString *resultText = result.text;
    for (MLKTextBlock *block in result.blocks) {
      NSMutableDictionary *blockDict = [NSMutableDictionary dictionary];
      [blockDict setValue:block.text forKey:@"text"];
      
      
      NSMutableArray *lines = [NSMutableArray array];
      for (MLKTextLine *line in block.lines) {
        NSMutableDictionary *lineDict = [NSMutableDictionary dictionary];
        [lineDict setValue:line.text forKey:@"text"];
       
        [lines addObject:lineDict];
      }
      [blockDict setValue:lines forKey:@"lines"];
      [blocks addObject:blockDict];
    }
    
    [response setValue:blocks forKey:@"blocks"];
    resolve(response);
  }];

}

@end

