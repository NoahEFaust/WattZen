double analogvalue;
int readIn = A0;
char publishString[40];

//continuously called
void loop() {
    // read in analog value from A0, convert, and publish for logging
    float aReadIn = (float) analogRead(readIn);
    analogvalue = (aReadIn/4095)*3.3;
    sprintf(publishString, "%lf", analogvalue);
    Particle.publish("analogvalue",publishString);
    delay(1000);
}

//setup up variable for api
void setup() {
    Particle.variable("analogvalue", &analogvalue, DOUBLE); 
    pinMode(readIn,INPUT);  // Our photoresistor pin is input (reading the photoresistor)
    
}
