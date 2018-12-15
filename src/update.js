'use strict';
const {app} = require('electron');
const {get} = require('https');
const dialog = require('./dialog');
const url = require('./url');

const {log} = console;

class Update {
  _compareToLocal(version) {
    const [x, y] = [version, app.getVersion()].map(x => x.split('.').map(Number));

    for (let i = 0; i < 3; i++) {
      const dif = x[i] - y[i];
      if (dif !== 0) {
        return dif;
      }
    }

    return 0;
  }

  _fetchUpdateData() {
    return new Promise((resolve, reject) => {
      const request = get(url.update, res => {
        const {statusCode: sc} = res;

        if (sc < 200 || sc > 299) {
          reject(new Error(`Request to get update data failed with HTTP status code: ${sc}`));
        }

        const data = [];
        res.on('data', d => data.push(d));
        res.on('end', () => resolve(JSON.parse(data.join(''))));
      });

      request.on('error', err => reject(err));
    });
  }

  _hasUpdate(version) {
    return this._compareToLocal(version) > 0;
  }

  async auto() {
    let latestVer;

    try {
      const data = await this._fetchUpdateData();
      latestVer = data.version;
    } catch (error) {
      return log(error);
    }

    if (this._hasUpdate(latestVer)) {
      return dialog.getUpdate(latestVer);
    }
  }

  async check() {
    let latestVer;

    try {
      const data = await this._fetchUpdateData();
      latestVer = data.version;
    } catch (error) {
      return dialog.updateError(error.message);
    }

    if (this._hasUpdate(latestVer)) {
      return dialog.getUpdate(latestVer);
    }

    return dialog.noUpdate();
  }
}

module.exports = new Update();
