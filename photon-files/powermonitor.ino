#include "math.h"
int analogvals[2500];
int cnt;
double Vmid = 1.61;
double RMScurrent;
char publishString[40];

void setup() {
    Particle.variable("RMScurrent", &RMScurrent, DOUBLE); 
}

void loop() {
    
    //very quickly sample the signal
    cnt = 0;
    
    while(cnt<2500){
        
        analogvals[cnt] = analogRead(A0); ///store current read to the array location cnt
        cnt = cnt + 1;
        
    }
    
    //Do transform the raw readings to squared current values
    cnt = 0;
    RMScurrent = 0;
    
    
    while(cnt<2500){
        
        RMScurrent = RMScurrent + pow((3.3*((double) analogvals[cnt])/4095-Vmid)*200,2); ///store current read to the array location cnt
        cnt = cnt + 1;
        
    }
    
    RMScurrent = sqrt(RMScurrent/2500);
    
    sprintf(publishString, "%lf", RMScurrent);
    Particle.publish("RMScurrent",publishString);
    delay(1000);
 
}
