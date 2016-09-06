
import { Quat } from "./Quat";
import { Vect3 } from "./Vect3";

enum RotSeq {
    zyx, zyz, zxy, zxz, yxz, yxy, yzx, yzy, xyz, xyx, xzy, xzx
};

class EulerAngle {

    protected static twoaxisrot(r11: number, r12: number, r21: number,
        r31: number, r32: number): Vect3 {
        let res = new Vect3();
        res.x = Math.atan2(r11, r12);
        res.y = Math.acos (r21);
        res.z = Math.atan2(r31, r32);
        return res;
    }

    protected static threeaxisrot(r11: number, r12: number, r21: number,
        r31: number, r32: number): Vect3 {
        let res = new Vect3();
        res.x = Math.atan2(r31, r32);
        res.y = Math.asin (r21);
        res.z = Math.atan2(r11, r12);
        return res;
    }
    // Code based on http://bediyap.com/programming/convert-quaternion-to-euler-rotations/
    public static fromQuaternion(q: Quat, order: RotSeq = RotSeq.xyz): Vect3 {

        switch(order) {
        case RotSeq.zyx:
            return this.threeaxisrot(2*(q.x*q.y + q.w*q.z),
                q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z,
                -2*(q.x*q.z - q.w*q.y),
                2*(q.y*q.z + q.w*q.x),
                q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z);

        case RotSeq.zyz:
            return this.twoaxisrot( 2*(q.y*q.z - q.w*q.x),
                2*(q.x*q.z + q.w*q.y),
                q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z,
                2*(q.y*q.z + q.w*q.x),
                -2*(q.x*q.z - q.w*q.y));

        case RotSeq.zxy:
            return this.threeaxisrot( -2*(q.x*q.y - q.w*q.z),
                q.w*q.w - q.x*q.x + q.y*q.y - q.z*q.z,
                2*(q.y*q.z + q.w*q.x),
                -2*(q.x*q.z - q.w*q.y),
                q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z);

        case RotSeq.zxz:
            return this.twoaxisrot( 2*(q.x*q.z + q.w*q.y),
                -2*(q.y*q.z - q.w*q.x),
                q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z,
                2*(q.x*q.z - q.w*q.y),
                2*(q.y*q.z + q.w*q.x));

        case RotSeq.yxz:
            return this.threeaxisrot( 2*(q.x*q.z + q.w*q.y),
                q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z,
                -2*(q.y*q.z - q.w*q.x),
                2*(q.x*q.y + q.w*q.z),
                q.w*q.w - q.x*q.x + q.y*q.y - q.z*q.z);

        case RotSeq.yxy:
            return this.twoaxisrot( 2*(q.x*q.y - q.w*q.z),
                2*(q.y*q.z + q.w*q.x),
                q.w*q.w - q.x*q.x + q.y*q.y - q.z*q.z,
                2*(q.x*q.y + q.w*q.z),
                -2*(q.y*q.z - q.w*q.x));

        case RotSeq.yzx:
            return this.threeaxisrot( -2*(q.x*q.z - q.w*q.y),
                q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z,
                2*(q.x*q.y + q.w*q.z),
                -2*(q.y*q.z - q.w*q.x),
                q.w*q.w - q.x*q.x + q.y*q.y - q.z*q.z);

        case RotSeq.yzy:
            return this.twoaxisrot( 2*(q.y*q.z + q.w*q.x),
                -2*(q.x*q.y - q.w*q.z),
                q.w*q.w - q.x*q.x + q.y*q.y - q.z*q.z,
                2*(q.y*q.z - q.w*q.x),
                2*(q.x*q.y + q.w*q.z));

        case RotSeq.xyz:
            return this.threeaxisrot( -2*(q.y*q.z - q.w*q.x),
                q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z,
                2*(q.x*q.z + q.w*q.y),
                -2*(q.x*q.y - q.w*q.z),
                q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z);

        case RotSeq.xyx:
            return this.twoaxisrot( 2*(q.x*q.y + q.w*q.z),
                -2*(q.x*q.z - q.w*q.y),
                q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z,
                2*(q.x*q.y - q.w*q.z),
                2*(q.x*q.z + q.w*q.y));

        case RotSeq.xzy:
            return this.threeaxisrot( 2*(q.y*q.z + q.w*q.x),
                q.w*q.w - q.x*q.x + q.y*q.y - q.z*q.z,
                -2*(q.x*q.y - q.w*q.z),
                2*(q.x*q.z + q.w*q.y),
                q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z);

        case RotSeq.xzx:
            return this.twoaxisrot( 2*(q.x*q.z - q.w*q.y),
                2*(q.x*q.y + q.w*q.z),
                q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z,
                2*(q.x*q.z + q.w*q.y),
                -2*(q.x*q.y - q.w*q.z));
        default:
            throw new Error("Unknown rotation sequence");
        }

    }
}
