#include "math.h"
int analogvals[2500];
int cnt,cnt2;
double Vmid = 1.61;
double avgsamp, RMScurrent;
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
        
        //create a averaged point of 10 samples
        cnt2 = 0;
        avgsamp = 0;
        while (cnt2<10){
            avgsamp = avgsamp + (double) analogvals[cnt];
            cnt = cnt + 1;
            cnt2 = cnt2 + 1;
        }
        
        RMScurrent = RMScurrent + pow((3.3*avgsamp/4095-Vmid)*20,2);//convert to a current, square it, and sum
    }
    
    RMScurrent = sqrt(RMScurrent/250);//root mean of 2500/10 = 250 averaged samples
    
    sprintf(publishString, "%lf", RMScurrent);
    Particle.publish("RMScurrent",publishString);
    delay(1000);
 
}
