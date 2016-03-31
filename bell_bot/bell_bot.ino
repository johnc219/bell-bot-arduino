#include <Servo.h>

Servo myServo;
byte servoPin = 8;
byte restAngle = 45;
byte ringAngle = 95;
byte successCode = 'S';
byte failCode = 'F';

void setup() {
  Serial.begin(9600);
  myServo.attach(servoPin);
  myServo.write(restAngle);
}

void loop() {
  if (Serial.available() > 0) {
    char input = char(Serial.read());
    
    if (input == 'R') {
      myServo.write(ringAngle);
      Serial.write(successCode);
      delay(1000);
      myServo.write(restAngle);
    }
    else {
      Serial.write(failCode);
    }
  }
}
