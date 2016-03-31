#include <Servo.h>

Servo myServo;
byte servoPin = 8;
byte centerAngle = 90;
byte maxAngle = 180;
byte successCode = 'S';
byte failCode = 'F'
char input;

void setup() {
  Serial.begin(9600);
  myServo.attach(servoPin);
  myServo.write(centerAngle);
}

void loop() {
  if (Serial.available() > 0) {
    input = char(Serial.read());
    
    if (input == 'R') {
      myServo.write(maxAngle);
      Serial.write(successCode);
      delay(1000);
      myServo.write(centerAngle);
    }
    else {
      Serial.write(failCode)
    }
  }
}
