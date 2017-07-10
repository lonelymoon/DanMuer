//Tween运动时间曲线
class Tween{
	constructor(){

	}

	linear(t, b, c, d){
		return c * t/d + b;
	}

	quad(type,...data){

		let linear = this.linear;

		const trail = {
			
			linear : linear,

			easeIn : ( t, b, c, d ) => c * ( t /= d ) * t + b,

			easeOut : ( t, b, c, d ) => -c *( t/=d )*( t - 2 ) + b,

			easeInOut : ( t, b, c, d ) => {
				if ( ( t/=d/2 ) < 1 ) return c/2 * t * t + b;
            	return -c/2 * ( (--t) * (t-2) - 1 ) + b;
			}

		}

		return !!trail[type] && trail[type](...data);
	}

	cubic(type,...data){
		let linear = this.linear;

		const trail = {
			
			linear : linear,

			easeIn: ( t, b, c, d ) => c * ( t /= d ) * t * t + b,

	        easeOut: ( t, b, c, d ) => c * ( ( t = t/d - 1 ) * t * t + 1 ) + b,

	        easeInOut: ( t, b, c, d ) => {
	            if ((t/=d/2) < 1) return c/2*t*t*t + b;
	            return c/2*((t-=2)*t*t + 2) + b;
	        }

		}

		return !!trail[type] && trail[type](...data);
	}

	quart(type,...data){
		let linear = this.linear;

		const trail = {
			
			linear : linear,

			easeIn: ( t, b, c, d ) => c * ( t /= d ) * t * t * t + b,

	        easeOut: ( t, b, c, d ) => -c * ( ( t = t/d - 1 ) * t * t * t - 1 ) + b,

	        easeInOut: ( t, b, c, d ) => {
	            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
	            return -c/2*((t-=2)*t*t*t - 2) + b;
	        }

		}

		return !!trail[type] && trail[type](...data);
	}

	quint(type,...data){
		let linear = this.linear;

		const trail = {
			
			linear : linear,

			easeIn: ( t, b, c, d ) => c * ( t /= d ) * t * t * t * t + b,

	        easeOut: ( t, b, c, d ) => c * ( ( t = t/d - 1 ) * t * t * t * t + 1 ) + b,

	        easeInOut: ( t, b, c, d ) => {
	            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	            return c/2*((t-=2)*t*t*t*t + 2) + b;
	        }

		}

		return !!trail[type] && trail[type](...data);
	}

}