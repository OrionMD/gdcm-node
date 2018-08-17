## Build on OSX or Linux

`cmake -D GDCM_BUILD_APPLICATIONS=ON -D GDCM_USE_SYSTEM_OPENSSL=ON \
-D GDCM_BUILD_DOCBOOK_MANPAGES=OFF -D GDCM_BUILD_SHARED_LIBS=OFF ../GDCM-2.8.7/`

`make`

### For Linux
`apt-get install cmake g++ openssl libssl-dev`
