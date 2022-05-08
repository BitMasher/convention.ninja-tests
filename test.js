// noinspection DuplicatedCode

import * as assert from "assert";
import fetch from "node-fetch";
import {initializeApp} from "firebase/app";
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth"
import {randomUUID} from 'crypto'

let creds = null;
let fbauth = null;

function setupAuth() {
    if (fbauth === null) {
        const firebaseConfig = {
            apiKey: "AIzaSyAGPcx9jOMAK-Z65fgDfykoNw06leABeSM",
            authDomain: "convention-ninja.firebaseapp.com",
            projectId: "convention-ninja",
            storageBucket: "convention-ninja.appspot.com",
            messagingSenderId: "656645627437",
            appId: "1:656645627437:web:1d957f0266da7767fce2a4"
        };
        initializeApp(firebaseConfig);
        fbauth = getAuth();
    }
    return fbauth;
}

async function createAccount() {
    if (creds === null) {
        try {
            creds = await createUserWithEmailAndPassword(fbauth, "test@example.com", "password1234test!")
        } catch (e) {
            creds = await signInWithEmailAndPassword(fbauth, "test@example.com", "password1234test!")
        }
    }
    return creds
}

function getCreds() {
    return creds;
}

describe('api tests', function () {
    before(async function () {
        setupAuth();
        await createAccount();
        await fetch('https://convention.ninja/api/users', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                name: 'test',
                displayName: 'test dn'
            })
        });
    })

    let user = null;

    describe('authorization', async function () {
        let urls = [
            {method: 'GET', url: 'users/me'},
            {method: 'GET', url: 'users'},
            {method: 'POST', url: 'users'},
            {method: 'DELETE', url: 'users/me'},
            {method: 'GET', url: 'orgs'},
            {method: 'POST', url: 'orgs'},
            {method: 'GET', url: 'orgs/1'},
        ]
        urls.forEach((e) => {
            it(`rejects access for endpoint ${e.method}:${e.url}`, async function () {
                const res = await fetch('https://convention.ninja/api/' + e.url, {
                    method: e.method,
                });
                assert.strictEqual(res.status, 401)
            })
        })

        describe('pre-onboard authorization', function () {
            let testcreds;
            before(async () => {
                try {
                    testcreds = await createUserWithEmailAndPassword(fbauth, 'delete@example.com', 'temp!23123!');
                } catch (e) {
                    testcreds = await signInWithEmailAndPassword(fbauth, 'delete@example.com', 'temp!23123!');
                }
            });
            let urls = [
                {method: 'GET', url: 'users/me'},
                {method: 'GET', url: 'users'},
                {method: 'DELETE', url: 'users/me'},
                {method: 'GET', url: 'orgs'},
                {method: 'POST', url: 'orgs'},
                {method: 'GET', url: 'orgs/1'},
            ]
            urls.forEach((e) => {
                it(`reject access before onboarding for endpoint ${e.method}:${e.url}`, async () => {
                    const res = await fetch('https://convention.ninja/api/' + e.url, {
                        method: e.method,
                        headers: {
                            Authorization: 'Bearer ' + await testcreds.user.getIdToken()
                        }
                    });
                    assert.strictEqual(res.status, 401);
                });
            });
            after(async () => {
                await fetch('https://convention.ninja/api/users', {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await testcreds.user.getIdToken(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'delete@example.com',
                        name: 'test',
                        displayName: 'test dn'
                    })
                });
                await fetch('https://convention.ninja/api/users/me', {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await testcreds.user.getIdToken()
                    }
                });
            });
        });
    });

    describe('user tests', function () {


        it('should reject bad onboard request', async () => {
            let testcreds;
            try {
                testcreds = await createUserWithEmailAndPassword(fbauth, 'delete@example.com', 'temp!23123!');
            } catch (e) {
                testcreds = await signInWithEmailAndPassword(fbauth, 'delete@example.com', 'temp!23123!');
            }
            let res = await fetch('https://convention.ninja/api/users', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + await testcreds.user.getIdToken(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            });
            assert.strictEqual(res.status, 400);
            res = await fetch('https://convention.ninja/api/users', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + await testcreds.user.getIdToken(),
                    'Content-Type': 'application/json',
                },
                body: 'asfasdfasdf'
            });
            assert.strictEqual(res.status, 400);
            res = await fetch('https://convention.ninja/api/users', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + await testcreds.user.getIdToken(),
                    'Content-Type': 'application/json',
                },
                body: ''
            });
            assert.strictEqual(res.status, 400);
        });
        it('should onboard the user', async () => {
            let testcreds;
            try {
                testcreds = await createUserWithEmailAndPassword(fbauth, 'delete@example.com', 'temp!23123!');
            } catch (e) {
                testcreds = await signInWithEmailAndPassword(fbauth, 'delete@example.com', 'temp!23123!');
            }
            const res = await fetch('https://convention.ninja/api/users', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + await testcreds.user.getIdToken(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'delete@example.com',
                    name: 'test',
                    displayName: 'test dn'
                })
            });
            assert.strictEqual(res.status, 200);
        });
        it('should reject on already onboarded', async () => {
            const res = await fetch('https://convention.ninja/api/users', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'asdf@asdf.asdf',
                    name: 'test',
                    displayName: 'test dn'
                })
            });
            assert.strictEqual(res.status, 409);
        });
        it('should return my user object', async () => {
            const res = await fetch('https://convention.ninja/api/users/me', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                }
            });
            assert.strictEqual(res.status, 200);
            let body = await res.json();
            user = body
            assert.strictEqual(body.email, 'test@example.com')
            assert.strictEqual(body.name, 'test')
            assert.strictEqual(body.displayName, 'test dn')
        });
        it('should not allow me to access another user', async () => {
            const res = await fetch('https://convention.ninja/api/users/0', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                }
            });
            assert.strictEqual(res.status, 401);
        });
        it('should allow me to access my own user', async () => {
            const res = await fetch('https://convention.ninja/api/users/' + user.id, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                }
            });
            assert.strictEqual(res.status, 200);
            let body = await res.json();
            user = body
            assert.strictEqual(body.email, 'test@example.com')
            assert.strictEqual(body.name, 'test')
            assert.strictEqual(body.displayName, 'test dn')
        });
        it('should not allow me to update another user', async () => {
            const res = await fetch('https://convention.ninja/api/users/0', {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'test',
                    displayName: 'test dn',
                    email: 'test@test.test'
                })
            });
            assert.strictEqual(res.status, 401);
        });
        it('should reject user update on bad request', async () => {
            let res = await fetch('https://convention.ninja/api/users/' + user.id, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json',
                },
                body: ''
            });
            assert.strictEqual(res.status, 400);
            res = await fetch('https://convention.ninja/api/users/' + user.id, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json',
                },
                body: 'asdfasdfasdfasdf'
            });
            assert.strictEqual(res.status, 400);
        });
        it('should allow me to update my user', async () => {
            let res = await fetch('https://convention.ninja/api/users/' + user.id, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'new name',
                    displayName: 'new dn',
                    email: 'new@example.com'
                })
            });
            assert.strictEqual(res.status, 200);
            let js = await res.json()
            assert.strictEqual(js.name, 'new name');
            assert.strictEqual(js.displayName, 'new dn');
            assert.strictEqual(js.email, 'new@example.com');

            res = await fetch('https://convention.ninja/api/users/me', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                }
            });
            assert.strictEqual(res.status, 200);
            js = await res.json();
            assert.strictEqual(js.name, 'new name');
            assert.strictEqual(js.displayName, 'new dn');
            assert.strictEqual(js.email, 'new@example.com');
        });

        it('should allow me to delete my user', async () => {
            let testcreds;
            try {
                testcreds = await createUserWithEmailAndPassword(fbauth, 'delete@example.com', 'temp!23123!');
            } catch (e) {
                testcreds = await signInWithEmailAndPassword(fbauth, 'delete@example.com', 'temp!23123!');
            }
            await fetch('https://convention.ninja/api/users', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + await testcreds.user.getIdToken(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    name: 'test',
                    displayName: 'test dn'
                })
            });
            let res = await fetch('https://convention.ninja/api/users/me', {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + await testcreds.user.getIdToken()
                }
            });
            assert.strictEqual(res.status, 200)
            res = await fetch('https://convention.ninja/api/users/me', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + await testcreds.user.getIdToken()
                }
            });
            assert.strictEqual(res.status, 401)
        })
    });

    describe('organization tests', function () {

        let org = null;

        it('should fetch empty org list', async () => {
            const res = await fetch('https://convention.ninja/api/orgs', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                }
            });
            assert.strictEqual(res.status, 200);
            let body = await res.json();
            assert.ok(Array.isArray(body));
            assert.strictEqual(body.length, 0);
        });
        it('should reject bad create org request', async () => {
            let res = await fetch('https://convention.ninja/api/orgs', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json'
                },
                body: ''
            });
            assert.strictEqual(res.status, 400);
            res = await fetch('https://convention.ninja/api/orgs', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json'
                },
                body: 'asdfasdfasdf'
            });
            assert.strictEqual(res.status, 400);
        })
        it('should create organization', async () => {
            let name = randomUUID();
            let res = await fetch('https://convention.ninja/api/orgs', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name
                })
            })
            assert.strictEqual(res.status, 200)
            org = await res.json()
            assert.strictEqual(org.name, name)
        });
        it('should reject duplicate organization creation', async () => {
            let res = await fetch('https://convention.ninja/api/orgs', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: org.name
                })
            });
            assert.strictEqual(res.status, 409);
        })
        it('should return 404 if org does not exist', async () => {
            let res = await fetch('https://convention.ninja/api/orgs/0', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                }
            });
            assert.strictEqual(res.status, 404);
        })
        it('should return existing org', async () => {
            let res = await fetch('https://convention.ninja/api/orgs/' + org.id, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                }
            });
            assert.strictEqual(res.status, 200);
            let body = await res.json();
            assert.strictEqual(body.id, org.id);
            assert.strictEqual(body.name, org.name);
            assert.strictEqual(body.ownerId, org.ownerId);
        });
        it('should reject on bad update request', async () => {
            let res = await fetch('https://convention.ninja/api/orgs/' + org.id, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json'
                },
                body: ''
            });
            assert.strictEqual(res.status, 400);
            res = await fetch('https://convention.ninja/api/orgs/' + org.id, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json'
                },
                body: 'asdfasdfasdf'
            });
            assert.strictEqual(res.status, 400);
            res = await fetch('https://convention.ninja/api/orgs/' + org.id, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([])
            });
            assert.strictEqual(res.status, 400);
        });
        it('should update org', async () => {
            let name = randomUUID();
            let res = await fetch('https://convention.ninja/api/orgs/' + org.id, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name
                })
            });
            assert.strictEqual(res.status, 200);
            let body = await res.json();
            assert.strictEqual(body.id, org.id);
            assert.strictEqual(body.ownerId, org.ownerId);
            org = body;
            assert.strictEqual(body.name, name);
        });
        it('should return the new org in the org list', async () => {
            let res = await fetch('https://convention.ninja/api/orgs', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                }
            });
            assert.strictEqual(res.status, 200);
            let body = await res.json();
            assert.ok(Array.isArray(body));
            assert.strictEqual(body.length, 1);
            assert.strictEqual(body[0].id, org.id);
        });
        it('should delete organization', async () => {
            let res = await fetch(`https://convention.ninja/api/orgs/${org.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                }
            });
            assert.strictEqual(res.status, 200);
            res = await fetch(`https://convention.ninja/api/orgs/${org.id}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                }
            });
            assert.strictEqual(res.status, 200);
            let body = await res.json();
            assert.ok(body.deletedAt);
        });
    });

    describe('inventory tests', function () {
        let org = null;
        before(async function () {
            let res = await fetch('https://convention.ninja/api/orgs', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: randomUUID()
                })
            });
            org = await res.json();
        });
        after(async function () {
            await fetch(`https://convention.ninja/api/orgs/${org.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                }
            });
        });
        describe('category tests', function () {
            it('should not allow unauthorized org access', async () => {
                let res = await fetch('https://convention.ninja/api/orgs/0/inventory/categories', {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 401);
            })
            it('should fetch empty list of categories', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 0);
            });
            it('should block bad creation requests', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: ''
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: 'asdfasdfasdf'
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                assert.strictEqual(res.status, 400);
            });
            let category = null;
            it('should create a new category', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test cat'
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.name, 'test cat');
                category = body;
            });
            it('should return the new category in the list', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 1);
                assert.strictEqual(body[0].id, category.id)
            });
            it('should return 404 on bad cat id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories/0`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            })
            it('should fetch the new category by id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories/${category.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, category.id);
                assert.strictEqual(body.name, category.name);
            });
            it('should reject on bad category update request', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories/${category.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: ''
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories/${category.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: 'asdfasdfasdf'
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories/${category.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                assert.strictEqual(res.status, 400);
            });
            it('should update category', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories/${category.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'new cat'
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, category.id);
                assert.strictEqual(body.name, "new cat");
                category = body;
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories/${category.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let testbody = await res.json();
                assert.strictEqual(testbody.name, 'new cat');
            });
            it('should delete category', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories/${category.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories/${category.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            });
        });
        describe('manufacturer tests', function () {
            it('should not allow unauthorized org access', async () => {
                let res = await fetch('https://convention.ninja/api/orgs/0/inventory/manufacturers', {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 401);
            })
            it('should fetch empty list of manufacturers', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 0);
            });
            it('should block bad creation requests', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: ''
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: 'asdfasdfasdf'
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                assert.strictEqual(res.status, 400);
            });
            let manufacturer = null;
            it('should create a new manufacturer', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test mfg'
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.name, 'test mfg');
                manufacturer = body;
            });
            it('should return the new manufacturer in the list', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 1);
                assert.strictEqual(body[0].id, manufacturer.id)
            });
            it('should return 404 on bad manufacturer id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers/0`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            })
            it('should fetch the new manufacturer by id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers/${manufacturer.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, manufacturer.id);
                assert.strictEqual(body.name, manufacturer.name);
            });
            it('should reject on bad manufacturer update request', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers/${manufacturer.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: ''
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers/${manufacturer.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: 'asdfasdfasdf'
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers/${manufacturer.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                assert.strictEqual(res.status, 400);
            });
            it('should update manufacturer', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers/${manufacturer.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'new mfg'
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, manufacturer.id);
                assert.strictEqual(body.name, "new mfg");
                manufacturer = body;
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers/${manufacturer.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let testbody = await res.json();
                assert.strictEqual(testbody.name, 'new mfg');
            });
            it('should delete manufacturer', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers/${manufacturer.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers/${manufacturer.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            });
        });
        describe('model tests', function () {
            let category = null;
            let mfg = null;
            before(async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test cat'
                    })
                });
                category = await res.json();
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test mfg'
                    })
                });
                mfg = await res.json();
            });
            after(async () => {
                await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories/${category.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers/${mfg.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
            });
            it('should not allow unauthorized org access', async () => {
                let res = await fetch('https://convention.ninja/api/orgs/0/inventory/models', {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 401);
            })
            it('should fetch empty list of models', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 0);
            });
            it('should block bad creation requests', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: ''
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: 'asdfasdfasdf'
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test'
                    })
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test',
                        categoryId: '0',
                        manufacturerId: mfg.id
                    })
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test',
                        categoryId: category.id,
                        manufacturerId: '0'
                    })
                });
                assert.strictEqual(res.status, 400);
            });
            let model = null;
            it('should create a new model', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test model',
                        categoryId: category.id,
                        manufacturerId: mfg.id
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.name, 'test model');
                assert.strictEqual(body.categoryId, category.id);
                assert.strictEqual(body.manufacturerId, mfg.id);
                model = body;
            });
            it('should return the new model in the list', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 1);
                assert.strictEqual(body[0].id, model.id)
                assert.strictEqual(body[0].category.id, category.id);
                assert.strictEqual(body[0].manufacturer.id, mfg.id);
            });
            it('should return 404 on bad model id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models/0`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            })
            it('should fetch the new model by id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models/${model.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, model.id);
                assert.strictEqual(body.name, model.name);
                assert.strictEqual(body.categoryId, model.categoryId);
                assert.strictEqual(body.manufacturerId, model.manufacturerId);
                assert.strictEqual(body.category.id, category.id);
                assert.strictEqual(body.manufacturer.id, mfg.id);
            });
            it('should reject on bad model update request', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models/${model.id}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: ''
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models/${model.id}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: 'asdfasdfasdf'
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models/${model.id}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                assert.strictEqual(res.status, 400);
            });
            it('should update model', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models/${model.id}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'new model'
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, model.id);
                assert.strictEqual(body.name, "new model");
                model = body;
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models/${model.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let testbody = await res.json();
                assert.strictEqual(testbody.name, 'new model');
            });
            it('should delete model', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models/${model.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models/${model.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            });
        });
        describe('asset tests', function () {
            let category = null;
            let mfg = null;
            let model = null;
            before(async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test cat'
                    })
                });
                category = await res.json();
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test mfg'
                    })
                });
                mfg = await res.json();
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test model',
                        categoryId: category.id,
                        manufacturerId: mfg.id
                    })
                });
                model = await res.json();
            });
            after(async () => {
                await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/categories/${category.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/manufacturers/${mfg.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/models/${model.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
            });
            it('should not allow unauthorized org access', async () => {
                let res = await fetch('https://convention.ninja/api/orgs/0/inventory/assets', {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 401);
            })
            it('should fetch empty list of assets', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 0);
            });
            it('should block bad creation requests', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: ''
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: 'asdfasdfasdf'
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                assert.strictEqual(res.status, 400);
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        modelId: '0',
                    })
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        modelId: model.id,
                        assetTags: 'asdfasdfa'
                    })
                });
                assert.strictEqual(res.status, 400);
            });
            let asset = null;
            it('should create a new asset', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        serialNumber: 'test asset',
                        modelId: model.id,
                        assetTags: ['tag1', 'tag2']
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.serialNumber, 'test asset');
                assert.strictEqual(body.modelId, model.id);
                assert.ok(Array.isArray(body.assetTags));
                assert.strictEqual(body.assetTags.length, 2);
                asset = body;
            });
            it('should return the new asset in the list', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 1);
                assert.strictEqual(body[0].id, asset.id)
                assert.strictEqual(body[0].serialNumber, asset.serialNumber);
                assert.strictEqual(body[0].model.id, model.id);
                assert.strictEqual(body[0].model.category.id, category.id);
                assert.strictEqual(body[0].model.manufacturer.id, mfg.id);
                assert.ok(Array.isArray(body[0].assetTags));
                assert.strictEqual(body[0].assetTags.length, 2);
            });
            it('should return 404 on bad asset id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/0`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            })
            it('should fetch the new asset by id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, asset.id)
                assert.strictEqual(body.serialNumber, asset.serialNumber);
                assert.strictEqual(body.model.id, model.id);
                assert.strictEqual(body.model.category.id, category.id);
                assert.strictEqual(body.model.manufacturer.id, mfg.id);
                assert.ok(Array.isArray(body.assetTags));
                assert.strictEqual(body.assetTags.length, 2);
            });
            it('should reject on bad asset update request', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: ''
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: 'asdfasdfasdf'
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                assert.strictEqual(res.status, 400);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        modelId: '0'
                    })
                });
                assert.strictEqual(res.status, 400);
            });
            it('should update asset', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        serialNumber: 'new asset'
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, asset.id);
                assert.strictEqual(body.serialNumber, "new asset");
                asset = body;
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let testbody = await res.json();
                assert.strictEqual(testbody.serialNumber, 'new asset');
            });
            it('should return the asset when barcode matches', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/barcode/tag1`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, asset.id)
                assert.strictEqual(body.serialNumber, asset.serialNumber);
                assert.strictEqual(body.model.id, model.id);
                assert.strictEqual(body.model.category.id, category.id);
                assert.strictEqual(body.model.manufacturer.id, mfg.id);
                assert.ok(Array.isArray(body.assetTags));
                assert.strictEqual(body.assetTags.length, 2);
            });
            it('should return no results for bad barcode', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/barcode/asfd`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            });
            it('should return list of asset barcodes', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}/barcodes`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 2);
            });
            it('should add barcode to asset', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}/barcodes`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tagId: 'tag3'
                    })
                });
                assert.strictEqual(res.status, 200);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}/barcodes`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 3);
            });
            it('should delete barcode from asset', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}/barcodes`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tagId: 'tag4'
                    })
                });
                assert.strictEqual(res.status, 200);
                let tag = await res.json();
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}/barcodes/${tag.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    }
                });
                assert.strictEqual(res.status, 200);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                let body = await res.json();
                assert.ok(!body.assetTags.some((e) => e.tagId === 'tag4'));
            });
            it('should delete asset', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/inventory/assets/${asset.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            });
        });
    });

    describe('event tests', function () {
        let org = null;
        before(async function () {
            let res = await fetch('https://convention.ninja/api/orgs', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: randomUUID()
                })
            });
            org = await res.json();
        });

        describe('venue tests', function () {
            it('should return an empty list of venues', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 0);
            });
            it('should reject bad create request', async () => {
                let values = ['', JSON.stringify({})];
                for (let value of values) {
                    let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues`, {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                            'Content-Type': 'application/json'
                        },
                        body: value
                    });
                    assert.strictEqual(res.status, 400);
                }
            });
            let venue = null;
            it('should create a new venue', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test venue',
                        address: 'test address'
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await body.json()
                assert.strictEqual(body.name, 'test venue');
                assert.strictEqual(body.address, 'test address');
                assert.strictEqual(body.organizationId, org.id)
                assert.ok(body.id);
                venue = body;
            });
            it('should return new venue in list of venues', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 1);
                assert.strictEqual(body[0].id, venue.id);
                assert.strictEqual(body[0].name, venue.name);
                assert.strictEqual(body[0].address, venue.address);
                assert.strictEqual(body[0].organizationId, org.id);
            });
            it('should return 404 for bad venue id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/0`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            });
            it('should return 401 for bad org id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/0/events/venues/${venue.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 401);
            });
            it('should return the new venue by id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, venue.id);
                assert.strictEqual(body.name, venue.name);
                assert.strictEqual(body.address, venue.address);
                assert.strictEqual(body.organizationId, venue.organizationId);
            });
            it('should reject bad update request', async () => {
                let values = ['', 'asdf'];
                for (let value of values) {
                    let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}`, {
                        method: 'PATCH',
                        headers: {
                            Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                            'Content-Type': 'application/json'
                        },
                        body: value
                    });
                    assert.strictEqual(res.status, 400);
                }
            });
            it('should update venue', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'update venue',
                        address: 'update address'
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.name, 'update venue');
                assert.strictEqual(body.address, 'update address');
                assert.strictEqual(body.id, venue.id);
                assert.strictEqual(body.organizationId, org.id);

                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                    }
                });
                let sample = await res.json();
                assert.strictEqual(sample.name, body.name);
                assert.strictEqual(sample.address, body.address);
                venue = body;
            });
            it('should return an empty list of rooms for the venue', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}/rooms`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 0);
            });
            it('should reject bad room create request', async () => {
                let values = ['', 'asdf', '{}'];
                for (let value of values) {
                    let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}/rooms`, {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                            'Content-Type': 'application/json'
                        },
                        body: value
                    });
                    assert.strictEqual(res.status, 400);
                }
            });
            let room = null;
            it('should create room in venue', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}/rooms`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test room'
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.name, 'test room');
                assert.strictEqual(body.venueId, venue.id);
                assert.strictEqual(body.organizationId, org.id);
                room = body;
            });
            it('should return new room in venue room list', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}/rooms`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 1);
                assert.strictEqual(body[0].id, room.id);
                assert.strictEqual(body[0].venueId, room.venueId);
                assert.strictEqual(body[0].organizationId, room.organizationId);
                assert.strictEqual(body[0].name, room.name);
            });
            it('should return 404 on bad room id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}/rooms/0`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            });
            it('should get room by id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}/rooms/${room.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, room.id);
                assert.strictEqual(body.venueId, room.venueId);
                assert.strictEqual(body.organizationId, room.organizationId);
                assert.strictEqual(body.name, room.name);
            });
            it('should reject bad room update request', async () => {
                let values = ['', 'asdf'];
                for (let value of values) {
                    let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}/rooms/${room.id}`, {
                        method: 'PUT',
                        headers: {
                            Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                            'Content-Type': 'application/json'
                        },
                        body: value
                    });
                    assert.strictEqual(res.status, 400);
                }
            });
            it('should update room', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}/rooms/${room.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'update room'
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, room.id);
                assert.strictEqual(body.name, 'update room');
                room = body;
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}/rooms/${room.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let testbody = await res.json();
                assert.strictEqual(body.id, testbody.id);
                assert.strictEqual(body.name, testbody.name);
            });
            it('should delete the room', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}/rooms/${room.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}/rooms/${room.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            })
            it('should delete venue', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues/${venue.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/venues`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                let body = await res.json();
                assert.strictEqual(body.length, 0);
            });

        });

        describe('event api tests', function () {
            let event = null;
            it('should return an empty list of events', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events`, {
                    method: 'GET',
                    headers: {
                        Authorizatin: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 0);
            });
            it('should reject on bad create event request', async () => {
                let values = ['', 'asdf', '{}', '{"name":"test event"}', '{"recurring":true}'];
                for (let value of values) {
                    let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events`, {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                            'Content-Type': 'application/json'
                        },
                        body: value
                    });
                    assert.strictEqual(res.status, 400);
                }
            });
            it('should create an event', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'test event',
                        recurring: true
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.name, 'test event');
                assert.strictEqual(body.recurring, true);
                assert.strictEqual(body.organizationId, org.id);
                event = body;
            });
            it('should list the new event in the org', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.length, 1);
                assert.strictEqual(body[0].id, event.id);
                assert.strictEqual(body[0].name, event.name);
                assert.strictEqual(body[0].recurring, event.recurring);
            });
            it('should get the event by id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, event.id);
                assert.strictEqual(body.organizationId, event.organizationId);
                assert.strictEqual(body.name, event.name);
                assert.strictEqual(body.recurring, event.recurring);
            });
            it('should return 404 on bad event id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/0`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            });
            it('should return empty list of schedules for event', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}/schedules`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 0);
            });
            it('should reject bad create schedule request', async () => {
                let values = ['', 'asdf', '{}', '{"startDate":"2021-01-01"}', '{"endDate":"2021-01-05"}', '{"startDate":"2021-01-05","endDate":"2021-01-01"}'];
                for (let value of values) {
                    let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}/schedules`, {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                            'Content-Type': 'application/json'
                        },
                        body: value
                    });
                    assert.strictEqual(res.status, 400);
                }
            });
            let schedule = null;
            it('should create schedule', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}/schedules`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        startDate: '2021-01-01',
                        endDate: '2021-01-05'
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.eventId, event.id);
                assert.strictEqual(body.organizationId, org.id);
                assert.strictEqual(body.startDate, '2021-01-01');
                assert.strictEqual(body.endDate, '2021-01-05');
                schedule = body;
            });
            it('should return new schedule in list of schedules', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}/schedules`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 1);
                assert.strictEqual(body[0].id, schedule.id);
                assert.strictEqual(body[0].startDate, schedule.startDate);
                assert.strictEqual(body[0].endDate, schedule.endDate);
                assert.strictEqual(body[0].eventId, scheudle.eventId);
                assert.strictEqual(body[0].organizationId, schedule.organizationId);
            });
            it('should get schedule by id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}/schedules/${schedule.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, schedule.id);
                assert.strictEqual(body.startDate, schedule.startDate);
                assert.strictEqual(body.endDate, schedule.endDate);
                assert.strictEqual(body.organizationId, schedule.organizationId);
                assert.strictEqual(body.eventId, schedule.eventId);
            });
            it('should return 404 on bad schedule id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}/schedules/0`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            });
            it('should reject bad update schedule request', async () => {
                let values = ['', 'asdf', '{"startDate":"2021-01-05","endDate":"2021-01-01"}'];
                for (let value of values) {
                    let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}/schedules/${schedule.id}`, {
                        method: 'PATCH',
                        headers: {
                            Authorization: 'Bearer ' + await getCreds().user.getIdToken(),
                            'Content-Type': 'application/json'
                        },
                        body: value
                    });
                    assert.strictEqual(res.status, 400);
                }
            });
            it('should update schedule by id', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}/schedules/${schedule.id}`, {
                    method: 'PATCH',
                    headers: {
                        Authorizatin: 'Bearer ' + await getCreds().user.getIdToken(),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        startDate: '2021-01-02',
                        endDate: '2021-01-06'
                    })
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.strictEqual(body.id, schedule.id);
                assert.strictEqual(body.startDate, '2021-01-02');
                assert.strictEqual(body.endDate, '2021-01-06');
                assert.strictEqual(body.organizationId, org.id);
                assert.strictEqual(body.eventId, event.id);
                schedule = body;
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}/schedules/${schedule.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let testbody = await res.json();
                assert.strictEqual(testbody.startDate, body.startDate);
                assert.strictEqual(testbody.endDate, body.endDate);
            });
            it('should get an empty list of schedule entries', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}/schedules/${schedule.id}/entries`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                let body = await res.json();
                assert.ok(Array.isArray(body));
                assert.strictEqual(body.length, 0);
            });
            it('should reject bad schedule entry create request', async () => {
                let values = ['', 'asdf']
            })
            it('should delete schedule', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}/schedules/${schedule.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}/schedules/${schedule.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            })
            it('should delete the event', async () => {
                let res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 200);
                res = await fetch(`https://convention.ninja/api/orgs/${org.id}/events/${event.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                    }
                });
                assert.strictEqual(res.status, 404);
            });
        });

        after(async function () {
            await fetch(`https://convention.ninja/api/orgs/${org.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + await getCreds().user.getIdToken()
                }
            });
        });


    })

    after(async function () {
        await fetch('https://convention.ninja/api/users/me', {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + await getCreds().user.getIdToken()
            }
        });
    })
});
