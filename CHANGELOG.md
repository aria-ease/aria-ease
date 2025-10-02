# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 2.1.0 (2025-10-02)


### Features

* added accessibility audit cli for simple automated audit and report generation ([4ac9330](https://github.com/aria-ease/aria-ease/commit/4ac93303b184d4b0f0ffeca42abdd8df776673a8))
* added accordion aria attributes uodate utility, and unit test ([8fd7c7c](https://github.com/aria-ease/aria-ease/commit/8fd7c7cf999e369ce662e8242231b98151426bb8))
* added checkbox component support, to update aria attributes, disabled handling key press for checkboxes and radios in the package ([f46b69a](https://github.com/aria-ease/aria-ease/commit/f46b69a357a380bbe4dc4377ba7e6f9154636d3c))
* added checkbox, radio and toggle utilities, and tests. fix: removed updating of aria-labels for menu, checkbox, and toggle. fix: refactored README ([295f9a9](https://github.com/aria-ease/aria-ease/commit/295f9a986b117715dcd3e51f8b6b19ffb039e69e))
* added makeBlockAccessible integration test for multi region keyboard navigation ([28b7451](https://github.com/aria-ease/aria-ease/commit/28b745177d5933a29700c006691b150245ed04c6))
* added menu accessibility functionality, unit and integration tests ([950ffe2](https://github.com/aria-ease/aria-ease/commit/950ffe2f980b9b5027eae02a7aae7a53d668823e))
* added radio component support, to update aria attributes to track state and purpose of radio buttons ([6d0c708](https://github.com/aria-ease/aria-ease/commit/6d0c708837d41df42c5a1b5ad6a12234b4a5e00e))
* added support for toggle buttons component. fix: abstracted checkbox and radio functionalities to single and group ([c2c2a79](https://github.com/aria-ease/aria-ease/commit/c2c2a7988a3d5ccf919e3fef33a3609179082fdf))
* added support for toggle buttons component. fix: abstracted checkbox and radio functionalities to single and group ([779a93a](https://github.com/aria-ease/aria-ease/commit/779a93ae856d576e67edeccdc2c2dbfcfaf46540))
* added text input key interaction and navigation intuitivity tests ([cf7ee69](https://github.com/aria-ease/aria-ease/commit/cf7ee6998809fcb5b13ce5bb973236e00eeb69f8))


### Bug Fixes

* added correct git repository in package.json ([baa402a](https://github.com/aria-ease/aria-ease/commit/baa402a96138a589b05ae318bf956a8e3d6e7da1))
* added event prevent default for each key press case to prevent default behavior ([814a86c](https://github.com/aria-ease/aria-ease/commit/814a86c8d15e9e662c7da778b775e8ae9e673915))
* added window width treshold for menu accessibility ([e35b273](https://github.com/aria-ease/aria-ease/commit/e35b2733b71ff0f1937e45e71b8dccc2277bc627))
* added window width treshold for menu accessibility ([2492807](https://github.com/aria-ease/aria-ease/commit/2492807271602e2e9633c3621b3be094a898f862))
* changed aria-pressed of checkbox to aria-checked ([48dc84d](https://github.com/aria-ease/aria-ease/commit/48dc84db27722c0ae4c5d85af2d5de611bda3092))
* changed inner width threshold for block to 992px ([368c3bb](https://github.com/aria-ease/aria-ease/commit/368c3bbf52173aaae29f4403a1d46e389901c2d0))
* changed inner width threshold for menu to 992px ([06c0011](https://github.com/aria-ease/aria-ease/commit/06c001173540599ddcf5f07000796abe39cedf13))
* cursor navigating in text input fields ([11d1f7f](https://github.com/aria-ease/aria-ease/commit/11d1f7f0db05c5e25b46a27e9ea6ce7ce4d0a416))
* fixed button and anchor tag not arrow key navigating ([fc18081](https://github.com/aria-ease/aria-ease/commit/fc180814ee237fd5fecee2b6af7d1dd0a341cd82))
* fixed keyboard navigation causing full page reload on link press" ([5c801d2](https://github.com/aria-ease/aria-ease/commit/5c801d2b97604ada2305bb0fbc8e1274b7c6cb3c))
* fixed menu Escape key press not updating aria attributes. fixed aria-pressed attribute causing screen reader to interprete buttons as checkboxes ([3d4a66e](https://github.com/aria-ease/aria-ease/commit/3d4a66e9f8494af3a92b091b968f427375ad4a3c))
* fixed menu not closing on press of Escape key ([ab9ea3f](https://github.com/aria-ease/aria-ease/commit/ab9ea3f51dd5e1dcb175c20c8365e49bfa94adf2))
* fixed radio input functions aria-label inconsistencies ([f9a0102](https://github.com/aria-ease/aria-ease/commit/f9a01024a9e70b50fc74f7eb4aeff6d19aa3bf36))
* fixed radio input functions aria-label inconsistencies ([4b2bc78](https://github.com/aria-ease/aria-ease/commit/4b2bc7869a9e072a477f997f48e936a44b25beac))
* fixed toggle button functions aria-label inconsistencies ([a61a9fa](https://github.com/aria-ease/aria-ease/commit/a61a9fa3b3bf90a1e2d079fb39a394ed31592519))
* fixed toggle button functions aria-label inconsistencies ([db0f059](https://github.com/aria-ease/aria-ease/commit/db0f05954a9775c927f105bba0cf00495ddb52c6))
* fixed tree-shaking not functioning. changed utility imports ([2987148](https://github.com/aria-ease/aria-ease/commit/29871486f62df996976106dbdf3cf4d0ea18523f))
* fleshed out README ([1de84e2](https://github.com/aria-ease/aria-ease/commit/1de84e205819f70deb86f5806867dab006aecf8f))
* improved cursor/sibling interactive items navigation for text input fields ([e430244](https://github.com/aria-ease/aria-ease/commit/e43024451a044114d9bd99d7fc2aa4699b9f5faa))
* refactored functions to remove unnecessary event prevent default ([74baa3f](https://github.com/aria-ease/aria-ease/commit/74baa3f29720f683720b6e7cbdbcceb49257f9a0))
* refactored package.json and README. added more comprehensive error handling to functions ([19b0eb7](https://github.com/aria-ease/aria-ease/commit/19b0eb73ee73ae966d721ef0c5729fd6bb7e9b2e))
* refactored READme for clearer understanding of concepts ([c23fe17](https://github.com/aria-ease/aria-ease/commit/c23fe17026c0f8d4b8af84a097750b33ae929cc7))
* refactored READme for clearer understanding of concepts ([5761527](https://github.com/aria-ease/aria-ease/commit/57615276b829effc8c77090c63125410e0a6d741))
* removed redundant id variable from AccordionStates interface ([6a2db5b](https://github.com/aria-ease/aria-ease/commit/6a2db5bb23b3fe5e512d0ea3997476f831db5a20))
* removed redundant menuClosedStateAriaLabel parameter in makeMenuAccessible function. updated logic to get the closed state aria-label automatically in the makeMenuAccessible function ([de59d8f](https://github.com/aria-ease/aria-ease/commit/de59d8f2926d8d545ab000aea7d88bfb92642dce))
* reverted window width constraint in menu and block functions. added block event listeners clean-up function ([fc01c0c](https://github.com/aria-ease/aria-ease/commit/fc01c0c897c28d18ff87cf449781e9f7e6c6db9a))
* revised README ([d982ece](https://github.com/aria-ease/aria-ease/commit/d982ece105be0b718972fecac85fcc54e4d71550))
* styled code snippets in README.md ([c9af356](https://github.com/aria-ease/aria-ease/commit/c9af356c9eef5405888b1484c8832fa1a0cbf13c))
* text input field not typing space ([506d902](https://github.com/aria-ease/aria-ease/commit/506d90260b23d2c10380725a19e268ea62517ca7))
* updated menu example code in README file ([78bf186](https://github.com/aria-ease/aria-ease/commit/78bf186de98d80447f019af96725f1db7ea007e1))
* updated README ([e5fba06](https://github.com/aria-ease/aria-ease/commit/e5fba06eef2197027ebfb423a26f8215c85f4016))
* updated README.md with correct menu implementation example ([d518dd3](https://github.com/aria-ease/aria-ease/commit/d518dd3b8453f31a1d404d6f8f9c3ae81888f1a8))
