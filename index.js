'use strict';
import { createServer } from 'http';
import { URL } from 'url';
import opn from 'open';
import destroyer from 'server-destroy';
import mongo from './db_connect.js';

await mongo.connectToMongoDB();

import { google } from 'googleapis';

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
    "274392673722-ar07sfov1gb0t134geoju446qseokjj3.apps.googleusercontent.com",
    "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",
    "http://localhost:3000/oauth2callback"
);

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({ auth: oauth2Client });

/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 */
async function authenticate() {
    return new Promise((resolve, reject) => {
        // grab the url that will be used for authorization
        const authorizeUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/youtube',
        });
        const server = createServer(async (req, res) => {
            try {
                if (req.url.indexOf('/oauth2callback') > -1) {
                    const qs = new URL(req.url, 'http://localhost:3000')
                        .searchParams;
                    res.end('Authentication successful! Please return to the console.');
                    server.destroy();
                    const { tokens } = await oauth2Client.getToken(qs.get('code'));
                    oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
                    resolve(oauth2Client);
                }
            } catch (e) {
                reject(e);
            }
        })
            .listen(3000, () => {
                // open the browser to the authorize url to start the workflow
                opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
            });
        destroyer(server);
    });
}

// Create yotube object
const youtube = google.youtube({ version: 'v3' });
async function liveReports() {
    // 
    const liveStream = await youtube.liveBroadcasts.list({
        part: ['snippet', 'status', 'contentDetails'],
        mine: true,
    });

    const userLiveStreamData = liveStream.data.items[0];
    const likes = await youtube.videos.list({
        id: userLiveStreamData.id,
        part: ['snippet', 'statistics']
    })
    console.log(userLiveStreamData, likes.data.items.map(i => i));
}

authenticate()
    .then(client => liveReports(client))
    .catch(console.error);