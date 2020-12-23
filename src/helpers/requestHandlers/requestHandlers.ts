import greeter from './greeter'
import help from './help'
import roomChooseName from './roomChooseName'
import roomCreated from './roomCreated'
import roomGameStarted from './roomGameStarted'
import roomJoin from './roomJoin'
import roomJoined from './roomJoined'
import roomJoinFailure from './roomJoinFailure'
import roomLeaveFailure from './roomLeaveFailure'
import roomNewParticipant from './roomNewParticipant'
import roomNotEnoughParticipants from './roomNotEnoughParticipants'
import roomNotFound from './roomNotFound'
import userLeavedRoom from './userLeavedRoom'
import userLeavingRoom from './userLeavingRoom'
import userDeletingRoom from './userDeletingRoom'
import userDeletedRoom from './userDeletedRoom'
import roomUserIsOwner from './roomUserIsOwner'
import userIsNotAnOwner from './userIsNotAnOwner'
import error from "./error";
import unknownCommand from "./unknownCommand";
import wishlistAdded from './wishlistAdded'

interface RequestHandlers {
	greeter: typeof greeter
	error: typeof error
	help: typeof help
	unknownCommand: typeof unknownCommand
	roomChooseName: typeof roomChooseName
	roomCreated: typeof roomCreated
	roomGameStarted: typeof roomGameStarted
	roomJoin: typeof roomJoin
	roomJoined: typeof roomJoined
	roomJoinFailure: typeof roomJoinFailure
	roomLeaveFailure: typeof roomLeaveFailure
	roomNewParticipant: typeof roomNewParticipant
	roomNotEnoughParticipants: typeof roomNotEnoughParticipants
	roomNotFound: typeof roomNotFound
	userLeavedRoom: typeof userLeavedRoom
	userLeavingRoom: typeof userLeavingRoom
	wishlistAdded: typeof wishlistAdded
	userDeletingRoom: typeof userDeletingRoom
	userDeletedRoom: typeof userDeletedRoom
	roomUserIsOwner: typeof roomUserIsOwner
	userIsNotAnOwner: typeof userIsNotAnOwner
	
}

class RequestHandlers {}
Object.assign(RequestHandlers.prototype, {
	greeter,
	help,
	error,
	unknownCommand,
	roomChooseName,
	roomCreated,
	roomGameStarted,
	roomJoin,
	roomJoined,
	roomJoinFailure,
	roomLeaveFailure,
	roomNewParticipant,
	roomNotEnoughParticipants,
	roomNotFound,
	userLeavedRoom,
	userLeavingRoom,
	wishlistAdded,
	userDeletingRoom,
	userDeletedRoom,
	roomUserIsOwner,
	userIsNotAnOwner,
})

export default RequestHandlers
