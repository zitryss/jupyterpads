import { Dialog, showDialog } from '@jupyterlab/apputils';
import { NotebookPanel } from '@jupyterlab/notebook';
import { Kernel, KernelMessage } from '@jupyterlab/services';
import * as React from 'react';
import { ReactElement } from 'react';
import SanitizedHTML from 'react-sanitized-html';

export default class NotebookUtilities {
  /**
   * Opens a pop-up dialog in JupyterLab to display a simple message.
   * @param title The title for the message popup
   * @param msg The message as an array of strings
   * @param buttonLabel The label to use for the button. Default is 'OK'
   * @param buttonClassName The classname to give to the 'ok' button
   * @returns Promise<void> - A promise once the message is closed.
   */
  public static async showMessage(
    title: string,
    msg: string[],
    buttonLabel = 'Dismiss',
    buttonClassName = ''
  ): Promise<void> {
    const buttons: ReadonlyArray<Dialog.IButton> = [
      Dialog.okButton({ label: buttonLabel, className: buttonClassName })
    ];
    const messageBody = this.buildDialogBody(msg);
    await showDialog({ title, buttons, body: messageBody });
  }

  /**
   * @description This function runs code directly in the notebook's kernel and then evaluates the
   * result and returns it as a promise.
   * @param kernel The kernel to run the code in.
   * @param runCode The code to run in the kernel.
   * @param userExpressions The expressions used to capture the desired info from the executed code.
   * @param runSilent Default is false. If true, kernel will execute as quietly as possible.
   * store_history will be set to false, and no broadcast on IOPUB channel will be made.
   * @param storeHistory Default is false. If true, the code executed will be stored in the kernel's history
   * and the counter which is shown in the cells will be incremented to reflect code was run.
   * @param allowStdIn Default is false. If true, code running in kernel can prompt user for input using
   * an input_request message.
   * @param stopOnError Default is false. If True, does not abort the execution queue, if an exception is encountered.
   * This allows the queued execution of multiple execute_requests, even if they generate exceptions.
   * @returns Promise<any> - A promise containing the execution results of the code as an object with
   * keys based on the user_expressions.
   * @example
   * //The code
   * const code = "a=123\nb=456\nsum=a+b";
   * //The user expressions
   * const expr = {sum: "sum",prod: "a*b",args:"[a,b,sum]"};
   * //Async function call (returns a promise)
   * sendKernelRequest(notebookPanel, code, expr,false);
   * //Result when promise resolves:
   * {
   *  sum:{status:"ok",data:{"text/plain":"579"},metadata:{}},
   *  prod:{status:"ok",data:{"text/plain":"56088"},metadata:{}},
   *  args:{status:"ok",data:{"text/plain":"[123, 456, 579]"}}
   * }
   * @see For more information on JupyterLab messages:
   * https://jupyter-client.readthedocs.io/en/latest/messaging.html#execution-results
   */
  public static async sendKernelRequest(
    kernel: Kernel.IKernelConnection,
    runCode: string,
    userExpressions: any,
    runSilent = false,
    storeHistory = false,
    allowStdIn = false,
    stopOnError = false
  ): Promise<any> {
    if (!kernel) {
      throw new Error('Kernel is null or undefined.');
    }

    const message: KernelMessage.IShellMessage = await kernel.requestExecute({
      // eslint-disable-next-line @typescript-eslint/camelcase
      allow_stdin: allowStdIn,
      code: runCode,
      silent: runSilent,
      // eslint-disable-next-line @typescript-eslint/camelcase
      stop_on_error: stopOnError,
      // eslint-disable-next-line @typescript-eslint/camelcase
      store_history: storeHistory,
      // eslint-disable-next-line @typescript-eslint/camelcase
      user_expressions: userExpressions
    }).done;

    const content: any = message.content;

    if (content.status !== 'ok') {
      // If response is not 'ok', throw contents as error, log code
      const msg = `Code caused an error:\n${runCode}`;
      console.error(msg);
      if (content.traceback) {
        content.traceback.forEach((line: string) =>
          console.log(
            line.replace(
              // eslint-disable-next-line no-control-regex
              /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
              ''
            )
          )
        );
      }
      throw content;
    }
    // Return user_expressions of the content
    return content.user_expressions;
  }

  /**
   * Same as method sendKernelRequest but passing
   * a NotebookPanel instead of a Kernel
   */
  public static async sendKernelRequestFromNotebook(
    notebookPanel: NotebookPanel,
    runCode: string,
    userExpressions: any,
    runSilent = false,
    storeHistory = false,
    allowStdIn = false,
    stopOnError = false
  ): Promise<any> {
    if (!notebookPanel) {
      throw new Error('Notebook is null or undefined.');
    }

    // Wait for notebook panel to be ready
    await notebookPanel.sessionContext.ready;

    return this.sendKernelRequest(
      notebookPanel.sessionContext.session.kernel,
      runCode,
      userExpressions,
      runSilent,
      storeHistory,
      allowStdIn,
      stopOnError
    );
  }

  public static async restartKernel(
    notebookPanel: NotebookPanel
  ): Promise<any> {
    if (!notebookPanel) {
      throw new Error('Notebook is null or undefined.');
    }

    // Wait for notebook panel to be ready
    await notebookPanel.sessionContext.ready;

    await notebookPanel.sessionContext.session.kernel.restart();
  }

  /**
   * Builds an HTML container by sanitizing a list of strings and converting
   * them in valid HTML
   * @param msg A list of string with HTML formatting
   * @returns a HTMLDivElement composed of a list of spans with formatted text
   */
  private static buildDialogBody(msg: string[]): ReactElement {
    return (
      <div className="dialog-body">
        {msg.map((s: string, i: number) => {
          return (
            <React.Fragment key={`msg-${i}`}>
              <SanitizedHTML
                allowedAttributes={{ a: ['href'] }}
                allowedTags={['b', 'i', 'em', 'strong', 'a', 'pre']}
                html={s}
              />
              <br />
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}
