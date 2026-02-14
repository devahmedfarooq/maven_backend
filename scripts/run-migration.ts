import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { TypeFieldMigrationService } from '../src/items/fix-type-field.migration';

async function runMigration() {
    const app = await NestFactory.createApplicationContext(AppModule);
    
    try {
        const migrationService = app.get(TypeFieldMigrationService);
        
        console.log('Starting type field migration...');
        
        // First validate current state
        console.log('\n=== VALIDATION ===');
        const validationResult = await migrationService.validateTypeFieldConsistency();
        console.log('Validation result:', validationResult);
        
        // Run migration
        console.log('\n=== MIGRATION ===');
        const migrationResult = await migrationService.fixTypeFieldInconsistencies();
        console.log('Migration result:', migrationResult);
        
        // Validate again after migration
        console.log('\n=== POST-MIGRATION VALIDATION ===');
        const postValidationResult = await migrationService.validateTypeFieldConsistency();
        console.log('Post-migration validation result:', postValidationResult);
        
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await app.close();
    }
}

runMigration().catch(console.error); 