import greeter from './greeter'
import help from './help'
import roomChooseName from './roomChooseName'
import roomCreated from './roomCreated'
import roomGameStarted from './roomGameStarted'
import roomJoin from './roomJoin'
import roomJoined from './roomJoined'
import roomLeaveFailure from './roomLeaveFailure'
import roomNewParticipant from './roomNewParticipant'
import roomNotEnoughParticipants from './roomNotEnoughParticipants'
import roomNotJoined from './roomNotJoined'
import userLeavedRoom from './userLeavedRoom'
import userLeavingRoom from './userLeavingRoom'

interface RequestHandlers {
	greeter: typeof greeter
	help: typeof help
	roomChooseName: typeof roomChooseName
	roomCreated: typeof roomCreated
	roomGameStarted: typeof roomGameStarted
	roomJoin: typeof roomJoin
	roomJoined: typeof roomJoined
	roomLeaveFailure: typeof roomLeaveFailure
	roomNewParticipant: typeof roomNewParticipant
	roomNotEnoughParticipants: typeof roomNotEnoughParticipants
	roomNotJoined: typeof roomNotJoined
	userLeavedRoom: typeof userLeavedRoom
	userLeavingRoom: typeof userLeavingRoom
}

class RequestHandlers {}
Object.assign(RequestHandlers.prototype, {
	greeter,
	help,
	roomChooseName,
	roomCreated,
	roomGameStarted,
	roomJoin,
	roomJoined,
	roomLeaveFailure,
	roomNewParticipant,
	roomNotEnoughParticipants,
	roomNotJoined,
	userLeavedRoom,
	userLeavingRoom,
})

export default RequestHandlers