import React, { useEffect, useState } from 'react';
import { INotebookTracker } from '@jupyterlab/notebook';
import Switch from '@material-ui/core/Switch';
import NotebookUtils from '../utils/NotebookUtils';
import { Box } from '@material-ui/core';
import Output from './output';
import Pipeline from './tabbar';
import Config from './config';
import { makeStyles } from '@material-ui/core/styles';

interface IProps {
  tracker: INotebookTracker;
}

const defaultInitCode = `import os
os.environ["AWS_ACCESS_KEY_ID"]="XSHDLTACETFLQURZSAUJ"
os.environ["AWS_SECRET_ACCESS_KEY"]="ISvyN9Aay40ZIaMuQcngOCJdzkSqR85ON1ng9PNZ"
os.environ["MLFLOW_S3_ENDPOINT_URL"]="http://ilz.dimis.fim.uni-passau.de:42415"
os.environ["MLFLOW_TRACKING_URI"]="http://ilz.dimis.fim.uni-passau.de:34025"
os.environ["MONGO_DB"]="pypads"
os.environ["MONGO_USER"]="pypads"
os.environ["MONGO_URL"]="mongodb://ilz.dimis.fim.uni-passau.de:29642"
os.environ["MONGO_PW"]="8CN7OqknwhYr3RO"
os.environ["SPARQL_QUERY_ENDPOINT"]="http://ilz.dimis.fim.uni-passau.de:14182/pypads/query"
os.environ["SPARQL_UPDATE_ENDPOINT"]="http://ilz.dimis.fim.uni-passau.de:14182/pypads/update"
os.environ["SPARQL_AUTH_NAME"]="admin"
os.environ["SPARQL_AUTH_PASSWORD"]="7gaUOSf0jNWlxre"
from pypads.app.base import PyPads
tracker = PyPads(uri=os.environ["MLFLOW_TRACKING_URI"])`;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  }
}));

export default function Sidebar(props: IProps) {
  const classes = useStyles();
  const { tracker } = props;
  const [isOn, setIsOn] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [initCode, setInitCode] = useState(defaultInitCode);
  const [expId, setExpId] = useState('');

  useEffect(() => {
    const setUp = async () => {
      await NotebookUtils.restartKernel(tracker.currentWidget)
        .then(() => {
          return NotebookUtils.sendKernelRequestFromNotebook(
            tracker.currentWidget,
            initCode,
            {}
          );
        })
        .catch((r: any) => {
          setIsOn(false);
          NotebookUtils.showMessage('Warning', [
            'PyPads initialization failed. See console for more details.'
          ]);
          console.log(r);
        });
    };

    const tearDown = async () => {
      const code = 'tracker.api.end_run()';
      await NotebookUtils.sendKernelRequestFromNotebook(
        tracker.currentWidget,
        code,
        {}
      ).catch((r: any) => {
        setIsOn(false);
        console.log(r);
      });
      await NotebookUtils.restartKernel(tracker.currentWidget).catch(
        (r: any) => {
          setIsOn(false);
          console.log(r);
        }
      );
    };

    if (isOn) {
      setUp();
      setIsFirstRun(false);
    } else {
      if (!isFirstRun) {
        tearDown();
      }
    }
  }, [isOn]);

  return (
    <div className={'jupyterpads-widget'}>
      <p>Version 2.0.120</p>
      <Box textAlign="center">
        Off
        <Switch
          checked={isOn}
          onClick={() => {
            setIsOn(!isOn);
          }}
        />
        On
      </Box>
      {isOn === false && (
        <div className={classes.root}>
          <Config {...{ initCode, setInitCode }} />
        </div>
      )}

      {isOn === true && (
        <div className={classes.root}>
          <Pipeline {...{ tracker, setExpId }} />
        </div>
      )}

      {isOn === true && expId !== '' && (
        <div className={classes.root}>
          <Output {...{ tracker, expId }} />
        </div>
      )}
    </div>
  );
}
