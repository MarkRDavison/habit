# Changelog

## 28/01/2022
-   Fix junit test results not being generated for API

## 27/01/2022
-   Add validation to ensure occurences for the same habit cannot be on the same date

## 26/01/2022
-   Added basic implementation of occurence display to the main home page
-   Added simple method of recording occurences by clicking non complete occurences

## 25/01/2022
-   Enhanced dev ops experience by not rebuilding containers whose hash has not change and \
    the image exists to be pulled
-   Based on what branch the build is running for determines what the tag is (latest/hash etc)