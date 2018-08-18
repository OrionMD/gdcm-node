## Build on OSX or Linux

`cmake -D GDCM_BUILD_APPLICATIONS=ON \
-D GDCM_BUILD_DOCBOOK_MANPAGES=OFF \
-D GDCM_BUILD_SHARED_LIBS=OFF \
-D CMAKE_EXE_LINKER_FLAGS="-static-libstdc++" \
../GDCM-2.8.7/`

`make`

### For Linux
`apt-get install -y cmake g++ openssl libssl-dev`
`cmake -D GDCM_BUILD_APPLICATIONS=ON \
-D GDCM_BUILD_DOCBOOK_MANPAGES=OFF \
-D GDCM_BUILD_SHARED_LIBS=OFF \
-D CMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++" \
../GDCM-2.8.7/`


Static linking info: https://stackoverflow.com/a/14082540/910324
