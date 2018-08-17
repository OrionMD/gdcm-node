# Generated by CMake

if("${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION}" LESS 2.5)
   message(FATAL_ERROR "CMake >= 2.6.0 required")
endif()
cmake_policy(PUSH)
cmake_policy(VERSION 2.6)
#----------------------------------------------------------------
# Generated CMake target import file.
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Protect against multiple inclusion, which would fail when already imported targets are added once more.
set(_targetsDefined)
set(_targetsNotDefined)
set(_expectedTargets)
foreach(_expectedTarget gdcmCommon gdcmDICT gdcmDSED gdcmIOD gdcmMSFF gdcmMEXD gdcmjpeg8 gdcmjpeg12 gdcmjpeg16 gdcmexpat gdcmopenjp2 gdcmcharls gdcmmd5 gdcmzlib gdcmuuid socketxx gdcmdump gdcmdiff gdcmraw gdcmscanner gdcmanon gdcmgendir gdcmimg gdcmconv gdcmtar gdcminfo gdcmscu gdcmxml gdcmpap3)
  list(APPEND _expectedTargets ${_expectedTarget})
  if(NOT TARGET ${_expectedTarget})
    list(APPEND _targetsNotDefined ${_expectedTarget})
  endif()
  if(TARGET ${_expectedTarget})
    list(APPEND _targetsDefined ${_expectedTarget})
  endif()
endforeach()
if("${_targetsDefined}" STREQUAL "${_expectedTargets}")
  unset(_targetsDefined)
  unset(_targetsNotDefined)
  unset(_expectedTargets)
  set(CMAKE_IMPORT_FILE_VERSION)
  cmake_policy(POP)
  return()
endif()
if(NOT "${_targetsDefined}" STREQUAL "")
  message(FATAL_ERROR "Some (but not all) targets in this export set were already defined.\nTargets Defined: ${_targetsDefined}\nTargets not yet defined: ${_targetsNotDefined}\n")
endif()
unset(_targetsDefined)
unset(_targetsNotDefined)
unset(_expectedTargets)


# Compute the installation prefix relative to this file.
get_filename_component(_IMPORT_PREFIX "${CMAKE_CURRENT_LIST_FILE}" PATH)
get_filename_component(_IMPORT_PREFIX "${_IMPORT_PREFIX}" PATH)
get_filename_component(_IMPORT_PREFIX "${_IMPORT_PREFIX}" PATH)
if(_IMPORT_PREFIX STREQUAL "/")
  set(_IMPORT_PREFIX "")
endif()

# Create imported target gdcmCommon
add_library(gdcmCommon SHARED IMPORTED)

# Create imported target gdcmDICT
add_library(gdcmDICT SHARED IMPORTED)

# Create imported target gdcmDSED
add_library(gdcmDSED SHARED IMPORTED)

set_target_properties(gdcmDSED PROPERTIES
  INTERFACE_LINK_LIBRARIES "gdcmCommon"
)

# Create imported target gdcmIOD
add_library(gdcmIOD SHARED IMPORTED)

set_target_properties(gdcmIOD PROPERTIES
  INTERFACE_LINK_LIBRARIES "gdcmDSED;gdcmCommon"
)

# Create imported target gdcmMSFF
add_library(gdcmMSFF SHARED IMPORTED)

set_target_properties(gdcmMSFF PROPERTIES
  INTERFACE_LINK_LIBRARIES "gdcmIOD;gdcmDSED;gdcmDICT"
)

# Create imported target gdcmMEXD
add_library(gdcmMEXD SHARED IMPORTED)

# Create imported target gdcmjpeg8
add_library(gdcmjpeg8 SHARED IMPORTED)

# Create imported target gdcmjpeg12
add_library(gdcmjpeg12 SHARED IMPORTED)

# Create imported target gdcmjpeg16
add_library(gdcmjpeg16 SHARED IMPORTED)

# Create imported target gdcmexpat
add_library(gdcmexpat SHARED IMPORTED)

# Create imported target gdcmopenjp2
add_library(gdcmopenjp2 SHARED IMPORTED)

# Create imported target gdcmcharls
add_library(gdcmcharls SHARED IMPORTED)

# Create imported target gdcmmd5
add_library(gdcmmd5 SHARED IMPORTED)

# Create imported target gdcmzlib
add_library(gdcmzlib SHARED IMPORTED)

# Create imported target gdcmuuid
add_library(gdcmuuid SHARED IMPORTED)

# Create imported target socketxx
add_library(socketxx SHARED IMPORTED)

# Create imported target gdcmdump
add_executable(gdcmdump IMPORTED)

# Create imported target gdcmdiff
add_executable(gdcmdiff IMPORTED)

# Create imported target gdcmraw
add_executable(gdcmraw IMPORTED)

# Create imported target gdcmscanner
add_executable(gdcmscanner IMPORTED)

# Create imported target gdcmanon
add_executable(gdcmanon IMPORTED)

# Create imported target gdcmgendir
add_executable(gdcmgendir IMPORTED)

# Create imported target gdcmimg
add_executable(gdcmimg IMPORTED)

# Create imported target gdcmconv
add_executable(gdcmconv IMPORTED)

# Create imported target gdcmtar
add_executable(gdcmtar IMPORTED)

# Create imported target gdcminfo
add_executable(gdcminfo IMPORTED)

# Create imported target gdcmscu
add_executable(gdcmscu IMPORTED)

# Create imported target gdcmxml
add_executable(gdcmxml IMPORTED)

# Create imported target gdcmpap3
add_executable(gdcmpap3 IMPORTED)

if(CMAKE_VERSION VERSION_LESS 2.8.12)
  message(FATAL_ERROR "This file relies on consumers using CMake 2.8.12 or greater.")
endif()

# Load information for each installed configuration.
get_filename_component(_DIR "${CMAKE_CURRENT_LIST_FILE}" PATH)
file(GLOB CONFIG_FILES "${_DIR}/GDCMTargets-*.cmake")
foreach(f ${CONFIG_FILES})
  include(${f})
endforeach()

# Cleanup temporary variables.
set(_IMPORT_PREFIX)

# Loop over all imported files and verify that they actually exist
foreach(target ${_IMPORT_CHECK_TARGETS} )
  foreach(file ${_IMPORT_CHECK_FILES_FOR_${target}} )
    if(NOT EXISTS "${file}" )
      message(FATAL_ERROR "The imported target \"${target}\" references the file
   \"${file}\"
but this file does not exist.  Possible reasons include:
* The file was deleted, renamed, or moved to another location.
* An install or uninstall procedure did not complete successfully.
* The installation package was faulty and contained
   \"${CMAKE_CURRENT_LIST_FILE}\"
but not all the files it references.
")
    endif()
  endforeach()
  unset(_IMPORT_CHECK_FILES_FOR_${target})
endforeach()
unset(_IMPORT_CHECK_TARGETS)

# This file does not depend on other imported targets which have
# been exported from the same project but in a separate export set.

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
cmake_policy(POP)
