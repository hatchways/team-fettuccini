const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const assert = chai.assert;
const isNotNull = assert.isNotNull;
const isNotNaN = assert.isNotNaN;
const isDefined = assert.isDefined;
const equal = assert.equal;
const notEqual = assert.notEqual;
const { Game, gamestate } = require("../engine/Game.js");
const GameWord = require("../engine/GameWord.js");
const MatchManager = require("../admin/MatchManagement.js");
const WordStates = require("../engine/WordStates.js");
const proxyquire = require("proxyquire");
chai.use(chaiHttp);

describe('MatchManagement', () => {
	
	beforeEach(function() {

	});
	
	afterEach(function() {
		MatchManager.onGoingMatchesByID.clear();
		MatchManager.publicMatches.clear();
		MatchManager.privateMatches.clear();
		MatchManager.numberInMatch.clear();
	});
	
	it("Need to be able to get every game type (onGoing, private, public)", () => {
		MatchManager.onGoingMatchesByID.set("onGoing", "anOnGoingMatch");
		MatchManager.publicMatches.set("public", "aPublicMatch");
		MatchManager.privateMatches.set("private", "aPrivateMatch");
		
		equal(MatchManager.getGame("onGoing"), "anOnGoingMatch");
		equal(MatchManager.getGame("public"), "aPublicMatch");
		equal(MatchManager.getGame("private"), "aPrivateMatch");
	});
	
	it("Need to group private and public games into separate maps.", () => {
		const instanceStub = { instance: sinon.stub() };
		const aStub = sinon.stub().returns(instanceStub);
		const matchManagementStub = proxyquire('../admin/MatchManagement', {
		    '../engine/Game': aStub
		});
		const publicMatch = matchManagementStub.createMatch("aHost1", true);
		const privateMatch = matchManagementStub.createMatch("aHost2", false);

		notEqual(publicMatch, undefined);notEqual(publicMatch, null);
		notEqual(privateMatch, undefined);notEqual(privateMatch, null);
		notEqual(publicMatch.matchID, undefined);
		notEqual(privateMatch.matchID, undefined);
		notEqual(publicMatch.matchID, null);
		notEqual(privateMatch.matchID, null);
	});
	
	it("Spy's need to get Spy info and field agents need to get field agent info", () => {
		const getBoardInfoStub = sinon.stub();
		getBoardInfoStub.withArgs(true).returns({boardInfo: "spyInfo"});
		getBoardInfoStub.withArgs(false).returns({boardInfo: "agentInfo"});
		
		const getRedSpyStub = sinon.stub().returns({id: "red spy"});
		const getBlueSpyStub = sinon.stub().returns({id: "blue spy"});
		const getRedFieldStub = sinon.stub().returns({id: "red field"});
		const getBlueFieldStub = sinon.stub().returns({id: "blue field"});
		const getHostStub = sinon.stub().returns("host");
		const getNumGuessStub = sinon.stub().returns("numGuess");
		const getChatHistoryStub = sinon.stub().returns("chat");
		const getStateStub = sinon.stub().returns("state");
		
		const stubbedGame = {
				getBoardInfo:  getBoardInfoStub,
				getRedSpy: getRedSpyStub,
				getBlueSpy: getBlueSpyStub,
				getRedField: getRedFieldStub,
				getBlueField: getBlueFieldStub,
				getHost: getHostStub,
				getNumGuess: getNumGuessStub,
				getChatHistory: getChatHistoryStub,
				getState: getStateStub
		}
		
		function checkInfo(info) {
			equal(info.RS.id, "red spy");
			equal(info.RF.id, "red field");
			equal(info.BS.id, "blue spy");
			equal(info.BF.id, "blue field");
			equal(info.Host, "host");
			equal(info.numGuess, "numGuess");
			equal(info.chatHistory, "chat");
			equal(info.state, "state");
		}
		
		function checkSpyInfo(info) {
			equal(info.info.boardInfo, "spyInfo");
			checkInfo(info);
		}
		
		function checkFieldInfo(info) {
			equal(info.info.boardInfo, "agentInfo");
			checkInfo(info);
		}
		
		MatchManager.publicMatches.set("testPublicMatch", stubbedGame);
		let info = MatchManager.getMatchInfo("testPublicMatch", "red spy");
		checkSpyInfo(info);
		
		info = MatchManager.getMatchInfo("testPublicMatch", "blue spy");
		checkSpyInfo(info);
		
		info = MatchManager.getMatchInfo("testPublicMatch", "red field");
		checkFieldInfo(info);
		
		info = MatchManager.getMatchInfo("testPublicMatch", "blue field");
		checkFieldInfo(info);
	});
	
});