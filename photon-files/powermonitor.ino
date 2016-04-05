#include "math.h"
int analogvals[2500];
int cnt;
float Vmid = 1.61;
float RMScurrent;
char publishString[40];

void setup() {

}

void loop() {


//very quickly sample the signal
cnt = 0;

while(cnt<1000){
    
    analogvals[cnt] = analogRead(A0); ///store current read to the array location cnt
    cnt = cnt + 1;
    
}

//Do transform the raw readings to squared current values
cnt = 0;
RMScurrent = 0;


while(cnt<1000){
    
    RMScurrent = RMScurrent + pow((3.3*((float) analogvals[cnt])/4095-Vmid)*200,2); ///store current read to the array location cnt
    cnt = cnt + 1;
    
}

RMScurrent = sqrt(RMScurrent/10000);

sprintf(publishString, "%lf", RMScurrent);
Particle.publish("RMScurrent",publishString);
delay(1000);
 
}
