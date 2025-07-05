export default class PetDTO {
    static getPetInputFrom = (pet) =>{
        if (typeof pet.name !== 'string' || pet.name.trim() === '') {
            throw new Error("Invalid or missing 'name'");
        }

        if (typeof pet.specie !== 'string' || pet.specie.trim() === '') {
            throw new Error("Invalid or missing 'specie'");
        }
        
        if (pet.image && typeof pet.image !== 'string') {
            throw new Error("Invalid 'image'");
        }
        
        const birthDate = new Date(pet.birthDate);
        if (isNaN(birthDate.getTime())) {
            throw new Error("Invalid 'birthDate'");
        }

        return {
            name:pet.name||'',
            specie:pet.specie||'',
            image: pet.image||'',
            birthDate:pet.birthDate||'12-30-2000',
            adopted:false
        }
    }
}