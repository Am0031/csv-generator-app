# MPAN Files CSV Generator

To support test teams when they need MPAN appointment files to upload in Sapphire, this generator will produce the CSV files in the right format based on the preferences selected.

More information on the files content and the flows [here](https://siemenscms.atlassian.net/wiki/spaces/Test/pages/1743618050/DTC+Flow+Creator+-+Test+Tool).

## Flows

### Scenario types 

|Scenario ID |Scenario type| Market Indicator|Metering|
|-------------|--------------|-------------------|--------------------|
|1|site set up|NHH|AMR|
|2|site set up|NHH|traditional|
|3|site set up|HH|HH|
|4|site set up|NHH|smart|
|5|site set up|NHH|none (new connection)|
|6|site set up|HH|none (new connection)|


### Documents needed per scenario
SC-1
```javascript
{
    title: "Scenario 1 - NHH/AMR", 
    files: ["D0155", "D0148", "D0150", "D0149", "D0302"]
}
```
SC-2
```javascript
{
    title: "Scenario 2 - NHH/Traditional", 
    files: ["D0155", "D0148", "D0150", "D0149", "D0302"]
}
```
SC-3
```javascript
{
    title: "Scenario 3 - HH/HH", 
    files: ["D0155", "D0268", "D0383", "D0384", "D0302"]
}
```
SC-4
```javascript
{
    title: "Scenario 4 - NHH/Smart", 
    files: ["D0155", "D0148", "D0150", "D0149", "D0302"]
}
```
SC-5
```javascript
{
    title: "Scenario 5 - NHH/None", 
    files: ["D0155", "D0148", "D0302"]
}
```
SC-6
```javascript
{
    title: "Scenario 6 - HH/None", 
    files: ["D0155", "D0148", "D0302"]
}
```

<!-- 
  "SC-1": {title: "Scenario 1 - NHH/AMR", files: ["D0155", "D0148", "D0150", "D0149", "D0302"]},
  "SC-2": {title: "Scenario 2 - NHH/Traditional", files: ["D0155", "D0148", "D0150", "D0149", "D0302"]}, 
  "SC-3": {title: "Scenario 3 - HH/HH", files: ["D0155", "D0268", "D0383", "D0384", "D0302"]},
  "SC-4": {title: "Scenario 4 - NHH/Smart", files: ["D0155", "D0148", "D0150", "D0149", "D0302"]},
  "SC-5": {title: "Scenario 5 - NHH/None", files: ["D0155", "D0148", "D0302"]},
  "SC-6": {title: "Scenario 6 - HH/None", files: ["D0155", "D0148", "D0302"]},
  -->
  
