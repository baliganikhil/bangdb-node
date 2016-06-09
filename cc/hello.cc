#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Number;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

   String::Utf8Value str(args[0]);
   const char * bar = * str;

  Local<String> num = String::NewFromUtf8(isolate, bar);

  args.GetReturnValue().Set(num);
  // args.GetReturnValue().Set(String::NewFromUtf8(isolate, num));
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(addon, init)

}
