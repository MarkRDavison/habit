import sayHello from '../src/sayHello'

test('sayHello can greet a user', (): void => {
    const user = { name: 'TypeScript' }
    expect(sayHello(user)).toBe('Hello TypeScript!')
})