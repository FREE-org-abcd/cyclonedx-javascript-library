'use strict'
/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const assert = require('assert')
const { suite, test } = require('mocha')

const {
  Enums,
  Models,
  Factories,
  Builders: { FromPackageJson: { ComponentBuilder } }
} = require('../../')

suite('Builders.FromPackageJson.ComponentBuilder', () => {
  const salt = Math.random()

  const extRefFactory = new Factories.FromPackageJson.ExternalReferenceFactory()
  extRefFactory.makeExternalReferences = () => [`FAKE REFERENCES ${salt}`]
  const licenseFactory = new Factories.LicenseFactory()
  licenseFactory.makeFromString = () => `FAKE LICENSE ${salt}`

  const sut = new ComponentBuilder(extRefFactory, licenseFactory)

  const data = {
    name: '@foo/bar',
    version: `1.33.7-alpha.23.${salt}`,
    description: `dummy lib ${salt}`,
    author: {
      name: 'Jane Doe',
      url: 'http://acme.org/~jd'
    },
    license: 'dummy license'
    // to be continued
  }
  const expected = new Models.Component(
    Enums.ComponentType.Library,
    'bar',
    {
      author: 'Jane Doe',
      description: `dummy lib ${salt}`,
      externalReferences: new Models.ExternalReferenceRepository([`FAKE REFERENCES ${salt}`]),
      licenses: new Models.LicenseRepository([`FAKE LICENSE ${salt}`]),
      group: '@foo',
      version: `1.33.7-alpha.23.${salt}`
    }
  )

  test('makeComponent', () => {
    const actual = sut.makeComponent(data)
    assert.deepStrictEqual(actual, expected)
  })
})
