
declare global {
    const testLog: Console;
    interface Window {
        testLog: Console;
    }
}

window.testLog = console;
export default window.testLog;