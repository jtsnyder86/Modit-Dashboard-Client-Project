import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// This saga handles dispatches from the user management components either to approve or delete new users attempting to register.
// Dispatches from researchers and admins are handled differently because the researcher dispatches are based on the user's institution ID.
// Dispatches from admins are based on an institution ID passed through params.

function* deleteRequest(action) {

    try {
        yield axios.delete(`/api/approveUsers/${action.payload}`);
        yield put({ type: 'GET_USERS' });
    } catch (err) {
        console.error('ERROR IN MANAGE ACCOUNTS DELETE', err)
    }
}

function* approveRequest(action) {
    try {
        yield axios.put(`/api/approveUsers/${action.payload}`);
        yield put({ type: 'GET_USERS' });
    } catch (err) {
        console.error('ERROR IN MANAGE ACCOUNTS PUT', err)
    }
}

function* deleteRequestAdmin(action) {

    try {
        yield axios.delete(`/api/approveUsers/admin/${action.payload.uid}`);
        yield put({ type: 'GET_USERS_ADMIN' });
    } catch (err) {
        console.error('ERROR IN MANAGE ACCOUNTS ADMIN DELETE', err)
    }
}

function* approveRequestAdmin(action) {

    try {
        yield axios.put(`/api/approveUsers/admin/${action.payload.uid}`);
        yield put({ type: 'GET_USERS_ADMIN', payload: action.payload.iid });
    } catch (err) {
        console.error('ERROR IN MANAGE ACCOUNTS ADMIN PUT', err)
    }
}

function* approveUsersSaga() {
    yield takeLatest('DELETE_REQUEST', deleteRequest);
    yield takeLatest('APPROVE_REQUEST', approveRequest);
    yield takeLatest('DELETE_REQUEST_ADMIN', deleteRequestAdmin);
    yield takeLatest('APPROVE_REQUEST_ADMIN', approveRequestAdmin);
}



export default approveUsersSaga;